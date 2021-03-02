import React ,{ Suspense } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import LoadingView from '../../Layouts/loading'
import { Layout } from 'antd';
import HeaderLayout from '../../../src/components/header/index';
import MainAppLayout from '../main';

const { Header, Content, Footer } = Layout

function Child() {
    let { link } = useParams()
    console.log('Child', link)
    switch (link) {
        case 'main-app':
            return <MainAppLayout />
        case 'foreign_trad':
            return <span>foreign_trad component</span>
        default:
            break
    }
}

const PagesView = () => {
    return (
        <Layout style={{ minWidth: 1070, height: '100vh' }} className="main-layout">
            <Header className="main-header-layout">
                <HeaderLayout />
            </Header>

            <Content>
                <Suspense fallback={<LoadingView />}>
                    <Switch>
                        <Route path="/home/:link" children={<Child />} />
                    </Switch>
                </Suspense>
            </Content>
            <Footer className="main-footer-layout">

            </Footer>
        </Layout>
    )
}

export default PagesView
