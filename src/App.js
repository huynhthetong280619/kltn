import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pages from '../src/Layouts/pages'
import LoadingView from '../src/Layouts/loading'
import '../src/styles/main.scss'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'
import Login from './Layouts/login';
import StoreTrading from './store-trading'
import CreateAccount from './Layouts/createAccount';
import ForgetPassword from './Layouts/forgetPassword';


function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

  }, [])


  if (isLoading) {
    return <LoadingView />
  }

  return (
    <>
      <I18nextProvider i18n={i18n}>
        {/* <Router> */}
        <Suspense fallback={<></>}>
          <StoreTrading>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/create-account" component={CreateAccount} />
              <Route path="/forget" component={ForgetPassword} />
              <Route exact path="/" component={Pages} />
              <Route path="/home" component={Pages} />
            </Switch>
          </StoreTrading>
        </Suspense>
        {/* </Router> */}
      </I18nextProvider>
    </>
  );
}

export default App;
