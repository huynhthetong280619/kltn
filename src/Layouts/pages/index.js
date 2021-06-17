import React, { Suspense, useContext, useEffect, useState, lazy } from 'react'
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
import Profile from '../profile';
import ZoomMeeting from '../zoom-meeting';
import Topic from '../topic';
import Discussion from '../discussion';
import Quiz from '../quiz';
import Student from '../manage/student';
import Survey from '../survey';
import TakeQuiz from '../take-quiz';
import AssignmentCheck from '../assignment-check';
import CreateAccount from '../createAccount';
import FooterLayout from '../footer-layout';
import SurveyTake from '../survey-take';
import ManageScore from '../manage-score';
import PublicClass from '../public-class';
import JohningZoom from '../zoom-meeting/johning-zoom';
import RestClient from '../../utils/restClient';

const { Header, Content, Footer } = Layout

const MainPages = lazy(() => import('../main'))


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
        case 'profile':
            return <Profile />
        case 'zoom-meeting':
            return <ZoomMeeting />
        case 'topic':
            return <Topic />
        case 'discuss':
            return <Discussion />
        case 'quiz':
            return <Quiz />
        case 'survey':
            return <Survey />
        case 'manage-student':
            return <Student />
        case 'manage-score':
            return <ManageScore />
        case 'take-quiz':
            return <TakeQuiz />
        case 'check-assignment':
            return <AssignmentCheck />
        case 'survey-take':
            return <SurveyTake />
        case 'public-class':
            return <PublicClass />
        case 'johning-zoom':
            return <JohningZoom />
        default:
            break
    }
}

const PagesView = () => {
    const [isOpen, setOpen] = useState(false)
    const history = useHistory()
    const { authFlag, token } = useContext(StoreTrading)


    useEffect(async () => {
        const localStorageToken = localStorage.getItem('API_TOKEN')
        let restClient;
        if (localStorageToken) {
            restClient = new RestClient({ localStorageToken })
        }
        else {
            restClient = new RestClient({ token })
        }


        await restClient.asyncGet('/course/public')
            .then(res => {
                if (res.hasError) {
                    history.push("/login")
                }
            })

    })

    return (
        <Layout style={{ minWidth: 1298, height: '100vh' }} className="main-layout">
            <Header className="main-header-layout">
                <HeaderLayout setOpen={setOpen} />
            </Header>

            <Content style={{ overflow: 'auto', background: '#232323', paddingTop: 25, paddingBottom: 25 }}>
                <Switch>
                    <Route exact path="/" component={MainPages} />
                    <Route exact path="/home" component={MainPages} />
                    <Route path="/home/:link" children={<Child />} />
                </Switch>
            </Content>
            <LeftBar isOpen={isOpen} setOpen={setOpen} />
        </Layout>
    )
}

export default PagesView
