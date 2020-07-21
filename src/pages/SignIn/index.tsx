import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import Logo from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={Logo} alt="GoBarber" />
      <form>
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
      </form>
      <Link to="/create">
        <FiLogIn />
        Create account
      </Link>
    </Content>
    <Background />
  </Container>
);

export default SignIn;
