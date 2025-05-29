import classNames from 'classnames';
import {NewWindowLink} from '../components';
import {setTitle, toWorker} from '../util';
import PropTypes from 'prop-types';

const Live = ({games, gamesInProgress}) => {
    setTitle('Live Game Simulation');

    return <div>
        <h1>Live Game Simulation <NewWindowLink /></h1>

        <p>To view a live play-by-play summary of a game, select one of tomorrow's games below.</p>

        {gamesInProgress ? <p className="text-danger">Stop the current game simulation to select a play-by-play game.</p> : null}

        {games.map(gm => {
            return <button
                key={gm.gid}
                className={classNames('btn', 'btn-default', {'btn-success': gm.highlight})}
                disabled={gamesInProgress}
                onClick={() => toWorker('actions.liveGame', gm.gid)}
                style={{float: 'left', margin: '0 1em 1em 0'}}
            >
                {gm.awayRegion}  vs<br />
                {gm.homeRegion}
            </button>;
        })}
    </div>;
};

Live.propTypes = {
    games: PropTypes.arrayOf(PropTypes.shape({
        awayName: PropTypes.string.isRequried,
        awayRegion: PropTypes.string.isRequried,
        gid: PropTypes.number.isRequried,
        highlight: PropTypes.bool.isRequried,
        homeName: PropTypes.string.isRequried,
        homeRegion: PropTypes.string.isRequried,
    })),
    gamesInProgress: PropTypes.bool,
};

export default Live;
