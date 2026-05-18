require('dotenv').config();

const mongoose = require('mongoose');
const { Lead } = require('../dist/models/Lead');

const sampleLeads = [
  ['Rahul Sharma', 'New', 'Website'],
  ['Ananya Verma', 'Contacted', 'Instagram'],
  ['Arjun Mehta', 'Qualified', 'Referral'],
  ['Priya Nair', 'Lost', 'Website'],
  ['Karan Malhotra', 'New', 'Instagram'],
  ['Neha Kapoor', 'Contacted', 'Referral'],
  ['Vikram Singh', 'Qualified', 'Website'],
  ['Aisha Khan', 'New', 'Referral'],
  ['Rohan Gupta', 'Lost', 'Instagram'],
  ['Meera Iyer', 'Contacted', 'Website'],
  ['Siddharth Rao', 'Qualified', 'Instagram'],
  ['Pooja Das', 'New', 'Website'],
  ['Aditya Joshi', 'Contacted', 'Referral'],
  ['Sneha Reddy', 'Lost', 'Referral'],
  ['Nikhil Bansal', 'Qualified', 'Website'],
  ['Ishita Sen', 'New', 'Instagram'],
  ['Manav Patel', 'Contacted', 'Website'],
  ['Tanvi Shah', 'Qualified', 'Referral'],
  ['Dev Arora', 'Lost', 'Website'],
  ['Riya Chatterjee', 'New', 'Referral'],
].map(([name, status, source], index) => ({
  name,
  email: `sample${index + 1}.servicehive.test@example.com`,
  status,
  source,
}));

async function seedLeads() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-hive-crm');

  const emails = sampleLeads.map((lead) => lead.email);
  await Lead.deleteMany({ email: { $in: emails } });

  const inserted = await Lead.insertMany(sampleLeads);
  console.log(`Inserted ${inserted.length} sample leads into ${mongoose.connection.name}`);

  await mongoose.disconnect();
}

seedLeads().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
