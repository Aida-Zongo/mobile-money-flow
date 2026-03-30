const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const User = require('../src/models/User');

const checkUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    const user = await User.findOne({ email: "aida04zng@gmail.com" }).lean();
    
    if (user) {
      fs.writeFileSync('./admin_user.json', JSON.stringify(user, null, 2));
      console.log("Saved to admin_user.json");
    } else {
      console.log("Not found");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

checkUser();
