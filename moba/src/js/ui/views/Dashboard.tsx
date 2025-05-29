import classNames from 'classnames';
import {setTitle} from '../util';
import { Component } from 'react';
import PropTypes from 'prop-types';

type Props = {
    leagues: {
        lid: number,
        name: string,
        phaseText: string,
        teamName: string,
        teamRegion: string,
    }[]
};

class Dashboard extends Component {
    props: Props;

    state: {
        activeLid: number | void,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            activeLid: undefined,
        };
    }

    setActiveLid(lid: number) {
        this.setState({
            activeLid: lid,
        });
    }

    render() {
        const {leagues} = this.props;

        setTitle('Dashboard');

        return <div>
            <ul className="dashboard-boxes">
                {leagues.map(l => <li key={l.lid} className="league-block">
                    <a
                        className={classNames('btn-custom2 league', {'league-active': l.lid === this.state.activeLid})}
                        href={`/l/${l.lid}`}
                        onClick={() => this.setActiveLid(l.lid)}
                        title={`${l.lid}. ${l.name}`}
                    >
                        {
                            l.lid !== this.state.activeLid
                        ?
                            <div>
                                <strong>{l.lid}. {l.name}</strong><br />
                                <span>{l.teamRegion}</span><br />
                                <span>{l.phaseText}</span>
                            </div>
                        :
                            <div>
                                <br />
                                <strong>Loading...</strong><br />
                            </div>
                        }
                    </a>
                    <a className="delete close" href={`/delete_league/${l.lid}`} aria-hidden="true">&times;</a>
                </li>)}
            </ul>
            <div className="btn-wrapper">
                <div className="dashboard-box-new">
                    <a href="/new_league" className="btn-custom1 btn-new-league">Create new league</a>
                </div>
            </div>
        </div>;
    }
}

Dashboard.propTypes = {
    leagues: PropTypes.arrayOf(PropTypes.shape({
        lid: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        phaseText: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
        teamRegion: PropTypes.string.isRequired,
    })).isRequired,
};

export default Dashboard;
