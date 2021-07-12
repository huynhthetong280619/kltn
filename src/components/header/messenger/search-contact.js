import { Col, Row, Typography, Spin, Button, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import RestClient from '../../../utils/restClient';

const { Text } = Typography;

const SearchContact = ({ searchText, isSearching, setIsSearching, openContactBox }) => {

    const restClient = new RestClient({ token: '' });

    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const loadContacts = (amount = 0) => {
        setIsLoading(true);
        restClient.asyncPost('/chatroom/contact',
            {
                searchText: searchText,
                current: amount
            })
            .then(res => {
                if (!res.hasError) {
                    setUsers(users.concat(res.data.contacts));
                }
            })
            .finally(() => {
                setIsLoading(false);
                setIsSearching(false);
            })
    }

    useEffect(() => {
        if (isSearching) {
            loadContacts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearching])

    return <>
        {users.map(user =>
            <Row
                key={user._id}
                style={{ padding: '4px', margin: ' 10px 4px' }}
                className="item-message"
                onClick={() => {
                    openContactBox(user);
                }}>
                <Col span={4} style={{ backgroundColor: 'red', height: 46, borderRadius: '50%', display: 'contents' }}>
                    <img src={user.urlAvatar} height={46} alt={user.firstName + " " + user.lastName} />
                </Col>
                <Col span={18} style={{
                    height: 46, lineHeight: 'initial', marginLeft: 10, display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Text style={{ color: '#e4e6eb' }}>{user.firstName + " " + user.lastName}</Text>
                </Col>
            </Row>
        )}
        <Row justify="center"
            hidden={isLoading}
        >
            <Button onClick={() => {
                loadContacts(users.length);
            }} >Load more</Button>
        </Row>
        {
            isLoading &&
            <Row justify="center">
                <Spin tip="Loading..."></Spin>
            </Row>
        }
    </>
}

export default SearchContact;