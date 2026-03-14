const { auth, db } = require('../config/firebase');

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Obtenir tous les utilisateurs (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       operator:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis)
 *       500:
 *         description: Erreur serveur
 */
const getAllUsers = async (req, res, next) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Supprimer un utilisateur (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis ou tentative de supprimer un autre admin)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
const deleteUser = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    const user = userDoc.data();

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Impossible de supprimer un autre administrateur',
      });
    }

    // Supprimer l'utilisateur dans Firebase Auth
    await auth.deleteUser(req.params.id);

    // Supprimer toutes les données associées dans Firestore
    const batch = db.batch();

    // Supprimer le document utilisateur
    batch.delete(db.collection('users').doc(req.params.id));

    // Supprimer toutes ses dépenses
    const expensesSnapshot = await db.collection('expenses')
      .where('userId', '==', req.params.id)
      .get();
    
    expensesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Supprimer tous ses budgets
    const budgetsSnapshot = await db.collection('budgets')
      .where('userId', '==', req.params.id)
      .get();
    
    budgetsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Supprimer toutes ses notifications
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.params.id)
      .get();
    
    notificationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Utilisateur et toutes ses données supprimés avec succès',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Obtenir les statistiques globales (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalExpenses:
 *                       type: integer
 *                     totalBudgets:
 *                       type: integer
 *                     totalNotifications:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis)
 *       500:
 *         description: Erreur serveur
 */
const getGlobalStats = async (req, res, next) => {
  try {
    const [
      usersSnapshot,
      expensesSnapshot,
      budgetsSnapshot,
      notificationsSnapshot,
    ] = await Promise.all([
      db.collection('users').get(),
      db.collection('expenses').get(),
      db.collection('budgets').get(),
      db.collection('notifications').get(),
    ]);

    const totalUsers = usersSnapshot.size;
    const totalExpenses = expensesSnapshot.size;
    const totalBudgets = budgetsSnapshot.size;
    const totalNotifications = notificationsSnapshot.size;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalExpenses,
        totalBudgets,
        totalNotifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getGlobalStats,
};
