import React /*{ Suspense, } */ from 'react'
// import { Switch, Route, useParams } from 'react-router-dom'
// import LoadingView from '../../Layouts/loading'
import { Layout } from 'antd';
import HeaderLayout from '../../../src/components/header/index';

const { Header, Content, Footer } = Layout

// function Child() {
//     let { link } = useParams()
//     switch (link) {
//         case 'market_cap':
//             return <span>market Cap component</span>
//         case 'foreign_trad':
//             return <span>foreign_trad component</span>

//         default:
//             break
//     }
// }

const PagesView = () => {
    return (
        <Layout style={{ minWidth: 1070 }} className="main-layout">
            <Header className="main-header-layout">
                <HeaderLayout />
            </Header>

            <Content>

            </Content>
            <Footer className="main-footer-layout">

            </Footer>
        </Layout>
    )
}

export default PagesView
