import { Button, InputNumber, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useTranslation } from 'react-i18next';
import { notifyError, notifySuccess } from '../../../assets/common/core/notify';
import excel from '../../../assets/images/contents/excel.png';
import RestClient from '../../../utils/restClient';


const TranscriptManage = ({ lstClassScore, idSubject }) => {

    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(false);

    const [transcript, setTranscript] = useState(lstClassScore)

    const restClient = new RestClient({ token: '' })
    const setRatio = (obj, ratio) => {
        let target = ratios.find(value => value._id === obj._id);
        target.ratio = ratio / 100;
    }


    const putTotalScore = async () => {
        //console.log('data', ratios)
        setLoading(true);
        await restClient.asyncPut(`/course/${idSubject}/ratio`, ratios)
            .then(res => {
                setLoading(false);
                if (!res.hasError) {
                    setTranscript(res.data);
                    notifySuccess('Thành công', 'Thay đổi hệ số thành công!');
                } else {
                    notifyError('Thất bại!', res.data.message);
                }
            })
    }

    let ratios = []

    useEffect(() => {
        ratios = []
        Object.keys(transcript.fields).map((c, i) => {
            if (i > 2 && i < Object.keys(transcript.fields).length - 1) {
                ratios.push(transcript.ratio[c]);
            }
        })
    }, [transcript])

    let columnsClassScore = []
    if (transcript) {

        columnsClassScore = Object.keys(transcript.fields).map((c, i) => {
            console.log(transcript)
            return {
                title: i > 2 && i < Object.keys(transcript.fields).length - 1 ? (<div><span>Hệ số <InputNumber
                    defaultValue={transcript.ratio[c].ratio * 100}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    onChange={(e) => setRatio(transcript.ratio[c], e)}
                    parser={value => value.replace('%', '')}
                /></span> <div>{transcript.fields[c]}</div></div>) : transcript.fields[c],
                dataIndex: c,
                key: c,
                width: 200,
                render: data => data !== null ? data : <span style={{ fontStyle: 'italic', color: '#ff4000' }}>Chưa nộp bài</span>
            }
        })
    }


    const headersClassScoreCSV = Object.keys(transcript.fields).map((c) => {
        return {
            label: transcript.fields[c],
            key: c
        }
    })


    return (<>
        <Row >
            <div style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }} className="mb-4">
                <div>
                    <CSVLink
                        filename={"Bảng điểm lớp học.csv"}
                        data={transcript.data}
                        headers={headersClassScoreCSV}
                        target="_blank"
                        style={{ color: "inherit", marginLeft: 5 }}
                    >
                        <span
                            id="Tooltip_history_csv"
                            className="left5"
                            placement="top"
                            style={{ padding: 0, marginTop: 3 }}
                        >
                            <img src={excel} width={20} />
                        </span>
                    </CSVLink>
                </div>
                <div>
                    <Button
                        type="primary"
                        className="lms-btn"
                        style={{ marginTop: 0 }}
                        loading={isLoading}
                        onClick={() => putTotalScore()}>{t('cfrm_table_points')}</Button>
                </div>
            </div>
        </Row>
        <Row style={{ overflow: 'auto' }} className="style-table">
            <Table pagination={false} columns={columnsClassScore} dataSource={transcript.data} style={{ width: '100%' }} scroll={{ y: 240, x: 700 }} />
        </Row>

    </>)
}


export default TranscriptManage