import {useLocation, useNavigate, useParams} from 'react-router-dom';

const withRouter = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        const location = useLocation();

        return (
            <Component
                navigate={navigate}
                location={location}
                params={useParams()}
                {...props}
            />
        );
    };
};

export default withRouter;