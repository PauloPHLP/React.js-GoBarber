import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Container, Content, AvatarInput } from './styles';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/Auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const defaultUserImage =
  'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png';

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user, updatedUser } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          name: Yup.string().required('Fill name field'),
          email: Yup.string().required('Fill e-mail field').email(),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Mandatory field'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Mandatory field'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), undefined],
              'The passwords does not match.',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updatedUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Profile updated succesfully!',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Something went wrong!',
          description: 'Error while updating profile.',
        });
      }
    },
    [addToast, history],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updatedUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar updated!',
          });
        });
      }
    },
    [addToast, updatedUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          onSubmit={handleSubmit}
          initialData={{ name: user.name, email: user.email }}
          ref={formRef}
        >
          <AvatarInput>
            <img src={user.avatar_url || defaultUserImage} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>
          <h1>My profile</h1>
          <Input name="name" type="text" placeholder="Name" icon={FiUser} />
          <Input name="email" type="email" placeholder="E-mail" icon={FiMail} />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            type="password"
            placeholder="Current password"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="New password"
            icon={FiLock}
          />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Password confirmation"
            icon={FiLock}
          />
          <Button type="submit">Confirm changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
