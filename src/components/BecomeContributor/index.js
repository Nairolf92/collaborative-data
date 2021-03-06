import React, { Component } from 'react';
// import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import { withFirebase } from '../Firebase';
import Button from "react-bootstrap/es/Button";
// import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    msgRequest :'',
    contributor : null,
    error: null,
};

const MSG_PENDING_CONTRIBUTOR = "Votre demande pour devenir contributeur est en cours d'examination par les administrateurs";
const MSG_REFUSED_CONTRIBUTOR = "Votre demande pour devenir contributeur a été refusée par les administrateurs";
const MSG_ACCEPTED_CONTRIBUTOR = "Vous êtes déjà contributeur ! Félicitations !";

class BecomeContributorBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        if(this.props.authUser.contributor !== undefined) {
            this.setState({ contributor : this.props.authUser.contributor });
            switch(this.props.authUser.contributor) {
                case 'refused' :
                    this.setState({ msgRequest : MSG_REFUSED_CONTRIBUTOR });
                    break;
                case 'accepted' :
                    this.setState({ msgRequest : MSG_ACCEPTED_CONTRIBUTOR });
                    break;
                case 'pending' :
                    this.setState({ msgRequest : MSG_PENDING_CONTRIBUTOR });
                    break;
                default :
                    this.setState({ msgRequest : MSG_PENDING_CONTRIBUTOR });
            }
        }
    }

    onClick = event => {
        const contributor = "pending";

        this.props.firebase.user(this.props.authUser.uid).update({
                contributor,
        })
        .then(() => {
            this.setState({ contributor : 'pending' });
            this.setState({ msgRequest : MSG_PENDING_CONTRIBUTOR });
        })
        .catch(error => {
            this.setState({ error });
        });
    };

    render() {
        const {  msgRequest ,error , contributor } = this.state;

        return (
            <div>
                {/*{console.log(contributor)}*/}
                {contributor === null || contributor === ""
                  ? <Button className="mb-3 mt-3 btn-custom" onClick={this.onClick} type="submit">
                    Je souhaite devenir contributeur (et gagner des tokens !)
                    </Button>
                  : <p>{msgRequest}</p>
                }
                {error && <p>{error.message}</p>}
            </div>
        );
    }
}


const BecomeContributor = compose(
    // withRouter,
    withFirebase,
)(BecomeContributorBase);

export default BecomeContributor;