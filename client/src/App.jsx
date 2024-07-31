import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import { Container, Alert } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import API from './API.mjs';
import Context from './contexts/Context';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import HomeLayout from './layouts/HomeLayout';
import ActivitiesLayout from './layouts/ActivitiesLayout';
import ProcessLayout from './layouts/ProcessLayout';
import ProposalsLayout from './layouts/ProposalsLayout';
import PreferencesLayout from './layouts/PreferencesLayout';
import AporovedLayout from './layouts/ApprovedLayout';

function App() {

  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [process, setProces] = useState();
  const [reloadProcess, setReloadProcess] = useState(false);
  const [reloadProposals, setReloadProposals] = useState(false);
  const [reloadPreferences, setReloadPreferences] = useState(false);
  const [loadApprovedList, setLoadApprovedList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    API.getProcess()
    .then(process => setProces(process))
    .then(() => setReloadProcess(false))
    .catch(err => setErrorMessage(err.message))
  }, [reloadProcess]);

  const loginHandler = async (credentials) => {
      const user = await API.login(credentials);
      setUser(user);
  }

  const logoutHandler = async () => {
    try {
      await API.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <Context.Provider value={{
      setErrorMessage, setReloadProcess, user, process, reloadProposals,
      setReloadProposals, reloadPreferences, setReloadPreferences, loadApprovedList, setLoadApprovedList
    }}>
      <Container fluid className="min-vh-100 d-flex  flex-column">
        <NavBar logoutHandler={logoutHandler} />
        <Alert
          dismissible
          show={errorMessage !== ''}
          onClose={() => setErrorMessage('')}
          variant="danger">
          {errorMessage}
        </Alert>
        <Container fluid className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path='/' element={<HomeLayout />} />
            <Route path='/login' element={<LoginForm loginHandler={loginHandler} />} />
            <Route path='/activities' element={<ActivitiesLayout />} >
              <Route path='/activities/process' element={<ProcessLayout />} />
              <Route path='/activities/proposals' element={<ProposalsLayout />} />
              <Route path='/activities/preferences' element={<PreferencesLayout />} />
              <Route path='/activities/approved' element={<AporovedLayout />} />
            </Route>
          </Routes>
        </Container>
      </Container>
    </Context.Provider>
  )
}

export default App
