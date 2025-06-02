import { useEffect } from 'react';
import { g } from '../../common';
import { getCols, setTitle } from '../util';
import { DataTable } from '../components';

interface ChampionRating {
    control: number;
    damage: number;
    mobility: number;
    toughness: number;
    utility: number;
    damageType: string;
    earlyMidLate: string;
    MR?: number;
    SAI?: number;
    carry?: number;
    disabler?: number;
    durable?: number;
    escapeR?: number;
    initiator?: number;
    jungler?: number;
    nuker?: number;
    pusher?: number;
    support?: number;
}

interface Champion {
    hid: number;
    name: string;
    role: string;
    ratings: ChampionRating;
    TOP?: number;
    JGL?: number;
    MID?: number;
    ADC?: number;
    SUP?: number;
    SAFE?: number;
    OFF?: number;
    ROAM?: number;
}

interface ChampionBasicProps {
    champions: Champion[];
}

const ChampionBasic: React.FC<ChampionBasicProps> = ({ champions }) => {
    useEffect(() => {
        setTitle('Champion Basic Info');
    }, []);

    let cols;
    let rows;

    if (g.champType === 0) {
        cols = getCols(
            'Champion',
            'Role',
            'Control',
            'Damage',
            'Mobility',
            'Toughness',
            'Utility',
            'Damage Type',
            'EML',
            'TOP',
            'JGL',
            'MID',
            'ADC',
            'SUP'
        );
        rows = champions.map(t => ({
            key: t.hid,
            data: [
                t.name,
                t.role,
                t.ratings.control,
                t.ratings.damage,
                t.ratings.mobility,
                t.ratings.toughness,
                t.ratings.utility,
                t.ratings.damageType,
                t.ratings.earlyMidLate,
                t.TOP,
                t.JGL,
                t.MID,
                t.ADC,
                t.SUP,
            ],
        }));
    } else {
        cols = getCols(
            'Champion',
            'MR',
            'SAI',
            'Carry',
            'Disabler',
            'Durable',
            'Escape',
            'Initiator',
            'Jungler',
            'Nuker',
            'Pusher',
            'Support',
            'EML',
            'SAFE',
            'OFF',
            'MID',
            'JGL',
            'ROAM'
        );
        rows = champions.map(t => ({
            key: t.hid,
            data: [
                t.name,
                t.ratings.MR,
                t.ratings.SAI,
                t.ratings.carry,
                t.ratings.disabler,
                t.ratings.durable,
                t.ratings.escapeR,
                t.ratings.initiator,
                t.ratings.jungler,
                t.ratings.nuker,
                t.ratings.pusher,
                t.ratings.support,
                t.ratings.earlyMidLate,
                t.SAFE,
                t.OFF,
                t.MID,
                t.JGL,
                t.ROAM,
            ],
        }));
    }

    return (
        <div>
            <h1>Champion Basic Stats</h1>
            <DataTable
                cols={cols}
                defaultSort={[0, 'desc']}
                name="ChampionBasic"
                rows={rows}
            />
        </div>
    );
};

export default ChampionBasic;
