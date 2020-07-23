import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Container, Content, Background, AnimationContainer } from './styles';
import { useToast } from '../../hooks/Toast';
import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          name: Yup.string().required('Fill name field'),
          email: Yup.string().required('Fill e-mail field').email(),
          password: Yup.string().min(
            6,
            'Password should have at least 6 characters',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Now you can sign in on GoBarber app!',
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
          description: 'Check your credentials',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Create an account</h1>
            <Input name="name" type="text" placeholder="Name" icon={FiUser} />
            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              icon={FiMail}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              icon={FiLock}
            />
            <Button type="submit">Create</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Go back to logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
