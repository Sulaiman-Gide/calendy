#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎉 Welcome to Kalendi Setup!');
console.log(
  'This will help you configure Supabase and Firebase for your calendar app.\n',
);

// Check if supabase.ts exists
const supabasePath = path.join(__dirname, 'src', 'services', 'supabase.ts');
if (!fs.existsSync(supabasePath)) {
  console.error('❌ Error: supabase.ts file not found!');
  process.exit(1);
}

console.log('📋 Setup Checklist:');
console.log('1. ✅ Create Supabase project at https://supabase.com');
console.log('2. ✅ Get your Supabase credentials');
console.log(
  '3. ✅ Create Firebase project at https://console.firebase.google.com',
);
console.log('4. ✅ Download Firebase config files');
console.log('5. ✅ Run the SQL commands in Supabase\n');

console.log('🔧 Next Steps:');
console.log('1. Update src/services/supabase.ts with your credentials');
console.log('2. Add Firebase config files to your project');
console.log('3. Run the SQL commands from SUPABASE_SETUP.md');
console.log('4. Test the app with: npm run ios\n');

console.log('📚 Documentation:');
console.log('- Supabase Setup: SUPABASE_SETUP.md');
console.log('- Firebase Setup: Follow the guide in SUPABASE_SETUP.md');
console.log('- App Features: README.md\n');

console.log('🚀 Ready to start? Run: npm run ios');
