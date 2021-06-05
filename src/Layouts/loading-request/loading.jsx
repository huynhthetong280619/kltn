import { Alert, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

const LoadingRequest = () => {
    const {t} = useTranslation()
    return (
        <Spin spinning>
            <Alert
                message={t('get_data_server')}
                description={t('reason_get_server')}
                type="info"
            />
        </Spin>
    )
}
export default (LoadingRequest);