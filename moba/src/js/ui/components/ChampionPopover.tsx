import { useState, useCallback } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { toWorker } from '../util';

const colorRating = (rating: number, type?: 'ovr') => {
    const classes = ['text-danger', 'text-warning', null, 'text-success'];

    // Different cutoffs for ovr and other ratings, cause it's not fair to expect excellence in all areas!
    let cutoffs = [30, 60, 80, Infinity];
    if (type === 'ovr') {
        cutoffs = [30, 45, 60, Infinity];
    }

    const ind = cutoffs.findIndex((cutoff) => rating < cutoff);
    return classes[ind];
};

interface ChampionPopoverProps {
    pid: number;
}

interface ChampionData {
    synergy: number;
    namesSyn: [string, string][];
    namesCtrs: [string, string][];
    namesCtr: [string, string][];
}

const ChampionPopover: React.FC<ChampionPopoverProps> = ({ pid }) => {
    const [championData, setChampionData] = useState<ChampionData | null>(null);

    const loadData = useCallback(async () => {
        const data = await toWorker('ratingsStatsPopoverInfoChampions', pid);
        if (data) {
            setChampionData(data);
        }
    }, [pid]);

    const renderRatingsBlock = () => {
        if (!championData) {
            return (
                <div className="row">
                    <div className="col-xs-12">
                        <b>Ratings</b><br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            );
        }

        const { namesSyn, namesCtrs, namesCtr } = championData;

        return (
            <div className="row">
                <div className="col-xs-6">
                    <b>Counters</b><br />
                    {namesCtrs.map(([_, name], index) => (
                        <span key={`counter-${index}`} className="text-success">
                            {name}<br />
                        </span>
                    ))}
                    <br />
                    <b>Counter</b><br />
                    {namesCtr.map(([_, name], index) => (
                        <span key={`countered-${index}`} className="text-danger">
                            {name}<br />
                        </span>
                    ))}
                </div>
                <div className="col-xs-6">
                    <b>Synergy</b><br />
                    {namesSyn.map(([_, name], index) => (
                        <span key={`synergy-${index}`} className="text-warning">
                            {name}<br />
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderStatsBlock = () => (
        <div className="row" style={{ marginTop: '1em' }}>
            <div className="col-xs-12">
                <b>Stats</b><br />
                <br />
                <br />
                <br />
            </div>
        </div>
    );

    const popoverContent = (
        <Popover id={`ratings-pop-${pid}`}>
            <div style={{ minWidth: '250px', whiteSpace: 'nowrap' }}>
                {renderRatingsBlock()}
                {renderStatsBlock()}
            </div>
        </Popover>
    );

    return (
        <OverlayTrigger
            onEnter={loadData}
            overlay={popoverContent}
            placement="bottom"
            rootClose
            trigger="click"
        >
            <span
                className="glyphicon glyphicon-stats watch"
                data-no-row-highlight="true"
                title="View synergy and counter"
            />
        </OverlayTrigger>
    );
};

export default ChampionPopover;
