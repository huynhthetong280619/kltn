import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Switch, Route, useParams, useHistory } from 'react-router-dom'
import LoadingView from '../../Layouts/loading'
import { Layout } from 'antd';
import HeaderLayout from '../../../src/components/header/index';
import MainAppLayout from '../main';
import Subject from '../subject';
import LeftBar from '../../components/left-bar';
import Setting from '../setting-app';
import TodoList from '../../components/todo-list';
import { StoreTrading } from '../../store-trading';

const { Header, Content, Footer } = Layout

function Child() {
    let { link } = useParams()
    
    console.log('Child', link)
    switch (link) {
        case 'main-app':
            return <MainAppLayout />
        case 'course-app':
            return <Subject />
        case 'setting':
            return <Setting />
        case 'todo-list':
            return <TodoList />

        default:
            break
    }
}

const PagesView = () => {
    const [isOpen, setOpen] = useState(false)
    const history = useHistory()
    const {authFlag} = useContext(StoreTrading)

    useEffect(() => {
        // const localStorageToken = localStorage.getItem('API_TOKEN')
        // if(!authFlag && localStorageToken){
        //     history.push("/login")
        // }
    })

    return (
        <Layout style={{ minWidth: 1298, height: '100vh' }} className="main-layout">
            <Header className="main-header-layout">
                <HeaderLayout setOpen={setOpen} />
            </Header>

            <Content style={{ overflow: 'auto', background: '#232323' }}>
                <Suspense fallback={<LoadingView />}>
                    <Switch>
                        <Route path="/home/:link" children={<Child />} />
                    </Switch>
                </Suspense>
            </Content>
            {/* <Footer className="main-footer-layout">

            </Footer> */}
            <LeftBar isOpen={isOpen} setOpen={setOpen} />
        </Layout>
    )
}

export default PagesView
