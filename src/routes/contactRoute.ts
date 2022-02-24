import * as express from 'express';
import * as V from '../services/ValidationContact';
import * as T from '../types';
import prismaClient from '../prisma';
import multerConfig from '../config/uploadImage';
import multer from 'multer';
const uploadImage = multer(multerConfig);

export const contactRoute = (app: express.Application) => {
  app.get('/ListContact', async (req, res) => {
    try {
      const ListContact = await prismaClient.contact.findMany({
        include: {
          telephones: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      return res.status(200).json({
        message: 'Todos os contatos',
        count: ListContact.length,
        contacts: ListContact,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar os contatos',
        ErroMessage: error.message,
      });
    }
  });
  app.get('/ListContactFavorite', async (req, res) => {
    try {
      const ListContactFavorite = await prismaClient.contact.findMany({
        where: {
          isFavorite: true,
        },
        include: {
          telephones: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      return res.status(200).json({
        message: 'Todos os contatos favoritos',
        count: ListContactFavorite.length,
        contacts: ListContactFavorite,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao listar os contatos',
        ErroMessage: error.message,
      });
    }
  });
  app.post('/newContact', uploadImage.single('img'), async (req, res) => {
    let image = 'http://localhost:4000/profilePicture/noImage.png';
    if (!req.file) {
      req.body.telephones = JSON.parse(req.body.telephones);
    } else {
      image = `http://localhost:4000/profilePicture/${req.file.filename}`;
    }
    req.body.isFavorite = JSON.parse(req.body.isFavorite);
    const contactData: T.ContactType = req.body;

    try {
      const error = V.ValidationCreateContact(contactData);
      if (error.length > 0) {
        return res.json(error);
      }
      const contact = await prismaClient.telephone.findFirst({
        where: {
          number: contactData.telephones.number,
        },
      });
      if (contact) {
        return res.status(200).json({
          message: 'Telefone já cadastrado',
        });
      }

      const result = await prismaClient.contact.create({
        data: {
          name: contactData.name,
          email: contactData.email,
          isFavorite: contactData.isFavorite,
          img: image,
          telephones: {
            create: {
              type: contactData.telephones.type,
              number: contactData.telephones.number,
            },
          },
        },
        include: {
          telephones: true,
        },
      });
      return res.status(201).json({
        message: 'Contato criado com sucesso',
        contact: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar um novo contato',
        error: error.message,
      });
    }
  });
  app.put('/setFavorite/:id', async (req, res) => {
    const contact_id = req.params.id;
    try {
      const contact = await prismaClient.contact.update({
        where: {
          id: contact_id,
        },
        data: {
          isFavorite: req.body.isFavorite,
        },
      });
      return res.status(200).json({
        message: 'Contato atualizado com sucesso',
        contact: contact,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao atualizar o contato',
        error: error.message,
      });
    }
  });
  app.put('/editContact/:id', uploadImage.single('img'), async (req, res) => {
    if (!req.file) {
      req.body.telephones = JSON.parse(req.body.telephones);
    }
    req.body.isFavorite = JSON.parse(req.body.isFavorite);
    const contactData: T.ContactType = req.body;
    const contact_id = req.params.id;
    try {
      const error = V.ValidationCreateContact(contactData);
      if (error.length > 0) {
        return res.json(error);
      }
      if (req.file) {
        req.body.img = `http://localhost:4000/profilePicture/${req.file.filename}`;
      }
      const update = await prismaClient.contact.update({
        where: {
          id: contact_id,
        },
        data: {
          name: contactData.name,
          email: contactData.email,
          isFavorite: contactData.isFavorite,
          img: req.body.img,
          telephones: {
            updateMany: {
              where: {
                contactId: contact_id,
              },
              data: {
                number: contactData.telephones.number,
                type: contactData.telephones.type,
              },
            },
          },
        },
        include: {
          telephones: true,
        },
      });
      return res.status(200).json({
        message: 'Contato atualizado com sucesso',
        contact: update,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao atualizar o contato',
        error: error.message,
      });
    }
  });
  app.delete('/DeletContact/:id', async (req, res) => {
    const contact_id = req.params.id;
    try {
      const contactTelephones = await prismaClient.telephone.deleteMany({
        where: {
          contactId: contact_id,
        },
      });
      const contact = await prismaClient.contact.delete({
        where: {
          id: contact_id,
        },
      });
      return res.status(200).json({
        message: 'Contato deletado com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao deletar o contato',
        ErroMessage: error.message,
      });
    }
  });
};
