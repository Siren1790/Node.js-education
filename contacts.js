const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId) || null;
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  let index = contacts.findIndex(contact => contact.id === contactId);
  if(index === -1){
    return 'The contact with this id is invalid';
  }
  const result = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify([...contacts], null, 2));
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const isReapet = contacts.find(contact => contact.name === name) || null;
  if (isReapet) {
    return "The contact is already in the list";
  }
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact], null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
