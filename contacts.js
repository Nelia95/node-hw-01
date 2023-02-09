const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join('./db', '/contacts.json');

function listContacts() {
  return fs.readFile(contactsPath).then(data => JSON.parse(data.toString()));
}

function getContactById(contactId) {
  return listContacts().then(contacts =>
    contacts.find(contact => contact.id.toString() === contactId.toString())
  );
}

async function removeContact(contactId) {
  const filteredContacts = await listContacts().then(contacts =>
    contacts.filter(contact => contact.id.toString() !== contactId.toString())
  );
  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
  return `Контакт ${contactId} успішно видалено`;
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  if (
    allContacts.some(
      contact =>
        name === contact.name ||
        email === contact.email ||
        phone === contact.phone
    )
  ) {
    console.log('Контакт з такими даними вже існує');
    return null;
  }
  const newContact = { id: `${Date.now()}`, name, email, phone };
  const newContacts = [...allContacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
