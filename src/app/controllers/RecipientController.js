import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import User from '../models/User';
import authConfig from '../../config/auth';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      cep: Yup.string().required(),
    });

    const user = await User.findByPk(req.userId);
    // console.log(user.dataValues);
    if (user && user.admin !== true) {
      return res.status(400).json({ error: 'You are not an admin.' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }
    const { email } = req.body;

    const recipient = await Recipient.findOne({ where: { email } });

    if (recipient) {
      return res.status(401).json({ error: 'Email already registered.' });
    }

    const { id, name, admin } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      email,
      admin,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      newMail: Yup.string().email(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    const user = await User.findByPk(req.userId);
    // console.log(user.dataValues);
    if (user && user.admin !== true) {
      return res.status(400).json({ error: 'You are not an admin.' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const { email, oldEmail } = req.body;

    const recipient = await Recipient.findOne({ where: { email: oldEmail } });

    if (!recipient) {
      return res.status(400).json({ error: 'Email is not registered.' });
    }

    if (oldEmail && oldEmail !== email) {
      const userExists = await Recipient.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email already registered.' });
      }
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }
}

export default new RecipientController();
