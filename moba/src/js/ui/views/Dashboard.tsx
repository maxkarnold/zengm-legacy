import classNames from 'classnames';
import { setTitle } from '../util';
import { useState } from 'react';

interface League {
    lid: number;
    name: string;
    phaseText: string;
    teamName: string;
    teamRegion: string;
}

interface DashboardProps {
    leagues?: League[];
}

function Dashboard({ leagues }: DashboardProps) {
    const [activeLid, setActiveLid] = useState<number | undefined>(undefined);

    setTitle('Dashboard');

    if (!leagues) {
        return (
            <div>
                <h1>Loading...</h1>
                <p>Please wait while your leagues are being loaded.</p>
            </div>
        );
    }

    return (
        <div>
            <ul className="dashboard-boxes">
                {leagues.map(l => (
                    <li key={l.lid} className="league-block">
                        <a
                            className={classNames('btn-custom2 league', { 'league-active': l.lid === activeLid })}
                            href={`/l/${l.lid}`}
                            onClick={() => setActiveLid(l.lid)}
                            title={`${l.lid}. ${l.name}`}
                        >
                            {l.lid !== activeLid ? (
                                <div>
                                    <strong>{l.lid}. {l.name}</strong><br />
                                    <span>{l.teamRegion}</span><br />
                                    <span>{l.phaseText}</span>
                                </div>
                            ) : (
                                <div>
                                    <br />
                                    <strong>Loading...</strong><br />
                                </div>
                            )}
                        </a>
                        <a className="delete close" href={`/delete_league/${l.lid}`} aria-hidden="true">&times;</a>
                    </li>
                ))}
            </ul>
            <div className="btn-wrapper">
                <div className="dashboard-box-new">
                    <a href="/new_league" className="btn-custom1 btn-new-league">Create new league</a>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
