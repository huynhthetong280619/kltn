import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Pages from '../src/Layouts/pages'
import LoadingView from '../src/Layouts/loading'
import '../src/styles/main.scss'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'
import Login from './Layouts/login';

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)

  }, [])


  if (isLoading) {
    return <LoadingView />
  }

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Suspense fallback={<LoadingView />}>
            <Route path="/login" component={Login} />
            <Route exact path="/home" component={Pages} />
          </Suspense>
        </Router>

      </I18nextProvider>
    </>
  );
}

export default App;
