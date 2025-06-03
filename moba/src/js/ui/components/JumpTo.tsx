import DropdownButton from 'react-bootstrap/DropdownButton';
import { Dropdown } from 'react-bootstrap';
import {g, helpers} from '../../common';

interface JumpToProps {
    season: number | 'all';
}

const genUrl = (parts: string[], season?: number | string) => {
    if (season !== undefined) {
        parts.push(String(season));
    }

    return helpers.leagueUrl(parts);
};

const JumpTo: React.FC<JumpToProps> = ({season}) => {
    // Sometimes the season will be some nonsense like "all", in which case we can't generally use
    // it (although maybe it would be good to in some cases). And if the season is g.season, there's
    // no need to pollute the URL with that, since it's the default on all pages.
    const s = typeof season === 'number' && season !== g.season ? String(season) : undefined;

    return <div className="pull-right">
        <DropdownButton id="jump-to-dropdown" title="Jump To">
            <Dropdown.Item href={genUrl(['standings'], s)}>Standings</Dropdown.Item>
            <Dropdown.Item href={genUrl(['playoffs'], s)}>Playoffs</Dropdown.Item>
            <Dropdown.Item href={genUrl(['history'], s)}>Season Summary</Dropdown.Item>
            <Dropdown.Item href={genUrl(['league_finances'], s)}>Finances</Dropdown.Item>
            <Dropdown.Item href={genUrl(['transactions', 'all'], s)}>Transactions</Dropdown.Item>
            <Dropdown.Item href={genUrl(['draft_summary'], s)}>Draft</Dropdown.Item>
            <Dropdown.Item href={genUrl(['leaders'], s)}>Leaders</Dropdown.Item>
            <Dropdown.Item href={genUrl(['team_stats'], s)}>Team Stats</Dropdown.Item>
            <Dropdown.Item href={genUrl(['player_stats', 'all'], s)}>Player Stats</Dropdown.Item>
            <Dropdown.Item href={genUrl(['player_ratings', 'all'], s)}>Player Ratings</Dropdown.Item>
        </DropdownButton>
    </div>;
};

export default JumpTo;
