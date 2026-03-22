const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ||
  'moneyflow_2026';

const register = async (req, res) => {
  try {
    console.log('=== REGISTER ===');
    console.log('Body:', req.body);

    const { name, email, password,
      phone, operator } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email, mot de passe requis'
      });
    }

    // Vérifie si email existe
    const existing =
      await User.findOne({ email });
    console.log('Existing user:', existing);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    // Hash password
    const hashed =
      await bcrypt.hash(password, 12);

    // Crée user
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone: phone || '',
      operator: operator || 'other',
      role: 'user',
    });

    console.log('User créé:', user._id);

    const token = jwt.sign(
      {
        uid: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        operator: user.operator,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('=== LOGIN ===');
    console.log('Body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const user = await User.findOne({ email })
      .select('+password');

    console.log('User found:', user?._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isValid = await bcrypt.compare(
      password, user.password
    );

    console.log('Password valid:', isValid);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const token = jwt.sign(
      {
        uid: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        operator: user.operator || '',
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.uid
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        operator: user.operator || '',
        role: user.role,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const Notification =
      require('../models/Notification');
    const notifications = await Notification
      .find({ userId: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(20);
    return res.json({
      success: true,
      notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const markNotificationsRead =
  async (req, res) => {
  try {
    const Notification =
      require('../models/Notification');
    await Notification.updateMany(
      { userId: req.user.uid, isRead: false },
      { isRead: true }
    );
    return res.json({
      success: true,
      message: 'Notifications lues'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, operator } = req.body;
    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (operator) user.operator = operator;
    await user.save();
    return res.json({ success: true, message: 'Profil mis à jour' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log('=== CHANGE PASSWORD ===');
    console.log('user uid:', req.user?.uid);
    console.log('body:', {
      hasCurrentPwd: !!req.body.currentPassword,
      hasNewPwd: !!req.body.newPassword,
    });

    const { currentPassword, newPassword } =
      req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nouveau mot de passe min 6 caractères'
      });
    }

    // Récupère user avec mot de passe
    let user = await User.findById(
      req.user.uid
    ).select('+password');

    // Si pas trouvé par _id, cherche par email
    if (!user && req.user.email) {
      user = await User.findOne(
        { email: req.user.email }
      ).select('+password');
    }

    console.log('User found:', !!user);
    console.log('User id:', user?._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Aucun mot de passe défini'
      });
    }

    // Vérifie mot de passe actuel
    const isValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    console.log('Password valid:', isValid);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hash et sauvegarde le nouveau
    const hashed = await bcrypt.hash(
      newPassword, 12
    );
    user.password = hashed;
    await user.save();

    console.log('Password updated successfully');

    return res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    console.error('changePassword error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const uid = req.user.uid;
    const Expense = require('../models/Expense');
    const Budget = require('../models/Budget');
    const Income = require('../models/Income');
    const Notification = require('../models/Notification');

    await Promise.all([
      Expense.deleteMany({ userId: uid }),
      Budget.deleteMany({ userId: uid }),
      Income.deleteMany({ userId: uid }),
      Notification.deleteMany({ userId: uid }),
      User.findByIdAndDelete(uid),
    ]);

    return res.json({ success: true, message: 'Compte supprimé' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getNotifications,
  markNotificationsRead,
  changePassword,
  deleteAccount,
  updateProfile,
};
