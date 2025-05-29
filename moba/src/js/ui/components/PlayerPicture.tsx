import faces from '../../vendor/faces';
import { Component } from 'react';
import PropTypes from 'prop-types';

class PlayerPicture extends Component {
    props: {
        face: object,
        imgURL?: string,
    };

    wrapper: HTMLDivElement | null;

    componentDidMount() {
        if (this.wrapper) {
            faces.display(this.wrapper, this.props.face);
        }
    }

    componentDidUpdate() {
        if (this.wrapper) {
            faces.display(this.wrapper, this.props.face);
        }
    }

    render() {
        if (this.props.imgURL) {
            this.wrapper = null;
            return <img
                alt="Player"
                src={this.props.imgURL}
                style={{maxHeight: '100%', maxWidth: '100%'}}
            />;
        }

        if (this.props.face) {
            return <div
                ref={wrapper => {
                    this.wrapper = wrapper;
                }}
            />;
        }

        return <div />;
    }
}

PlayerPicture.propTypes = {
    face: PropTypes.object,
    imgURL: PropTypes.string,
};

export default PlayerPicture;
