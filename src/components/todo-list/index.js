import { Badge, Col } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { StoreTrading } from '../../store-trading'
import RestClient from '../../utils/restClient'
import { ReactComponent as IC_TODO } from '../../assets/images/todo-item.svg'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { get } from 'lodash'
import { useHistory } from 'react-router'

const TodoList = () => {
    const {t} = useTranslation()
    const { token } = useContext(StoreTrading)

    const [todolist, setTodoslist] = useState([])
    const history = useHistory()
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        getTodosList()
    }, [])

    const getTodosList = async () => {
        const restClientAPI = new RestClient({ token })

        await restClientAPI.asyncGet('/subject/deadline')
            .then(res => {
                if (!res.hasError) {
                    const { deadline } = res?.data
                    setTodoslist(deadline)
                }
            })
    }


    const transTime = (time) => {
        return moment(time).format('DD MMM YYYY h:mm A')
    }

    const getType = (type) => {
        switch (type) {
            case 'exam':
                return 'Exam';
            case 'assignment':
                return 'Assignment';
            case 'survey':
                return 'Survey';
            default:
                return 'Exam';
        }
    }

    const checkUrgentDay = (end) => {
        const startDate = moment.utc();
        const endDate = moment.utc(end);

        const duration = moment.duration(endDate.diff(startDate));

        if (duration.days() < 2) {
            return true
        }
        return false
    }

    console.log('todolist', todolist)

    return <div>
        <main className="main-todolist-layout">
            <div></div>
            <div className="main-content-todolist">
                {/* <div className="empty-content-todolist"></div>
                <div className="title-empty-content-todolist__f">
                    Bài tập được giao sẽ xuất hiện ở đây
                </div>
                <div className="title-empty-content-todolist__s">
                    Bạn hiện chưa được giao bài tập nào
                </div> */}
                {
                    todolist.map(item => {
                        return <Badge.Ribbon placement="end" text={flag ? t('completed') : checkUrgentDay(get(item, 'expireTime')) ? t('urgent_upcoming_deadline') : t('not_done')} color={flag ? '#4cd137' : checkUrgentDay(get(item, 'expireTime')) ? '#e84118' : '#00a8ff'}
                        >
                            <div className="todos-item mb-4">
                                <div className="todos-item__f">
                                    <Col span={24} style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={() => history.push('/home/course-app', {_id: item?.idSubject})}
                                    >
                                        <Col className="todos-item__ic">
                                            <IC_TODO />
                                        </Col>
                                        <Col >
                                            <div className="todos-item__n">[{getType(item.type)}] {item?.name}</div>
                                            <div className="todos-item__t">{transTime(get(item, 'expireTime'))}</div>
                                        </Col>
                                    </Col>
                                    
                                </div>
                            </div>
                        </Badge.Ribbon>
                    })
                }

            </div>
        </main>
    </div>
}

export default TodoList