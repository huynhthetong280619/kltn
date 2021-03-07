import React, { Suspense, useState } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import LoadingView from '../../Layouts/loading'
import { Layout } from 'antd';
import HeaderLayout from '../../../src/components/header/index';
import MainAppLayout from '../main';
import CourseApp from '../course';
import LeftBar from '../../components/left-bar';
import Setting from '../setting-app';

const { Header, Content, Footer } = Layout

function Child() {
    let { link } = useParams()
    console.log('Child', link)
    switch (link) {
        case 'main-app':
            return <MainAppLayout />
        case 'course-app':
            return <CourseApp />
        case 'setting':
            return <Setting />
        default:
            break
    }
}

const PagesView = () => {
    const [isOpen, setOpen] = useState(false)

    return (
        <Layout style={{ minWidth: 1070, height: '100vh' }} className="main-layout">
            <Header className="main-header-layout">
                <HeaderLayout setOpen={setOpen} />
            </Header>

            <Content style={{ overflow: 'auto' }}>
                <Suspense fallback={<LoadingView />}>
                    <Switch>
                        <Route path="/home/:link" children={<Child />} />
                    </Switch>
                </Suspense>
            </Content>
            <Footer className="main-footer-layout">

            </Footer>
            <LeftBar isOpen={isOpen} setOpen={setOpen} />
        </Layout>
    )
}

export default PagesView
