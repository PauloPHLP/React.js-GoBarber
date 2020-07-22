import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Container, Content, Background } from './styles';
import { useAuth } from '../../hooks/AuthContext';
import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          email: Yup.string().required('Fill e-mail field').email(),
          password: Yup.string().required('Fill password field'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn({
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Content>
        <img src={Logo} alt="GoBarber" />
        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Logon into GoBarber</h1>
          <Input name="email" type="email" placeholder="E-mail" icon={FiMail} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={FiLock}
          />
          <Button type="submit">Logon</Button>

          <a href="forgot">I forgot my password</a>
        </Form>
        <Link to="/create">
          <FiLogIn />
          Create account
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
