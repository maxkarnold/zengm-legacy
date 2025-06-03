import { helpers, g } from '../../common';
import { FC } from 'react';

interface RecordAndPlayoffsProps {
    abbrev: string;
    lost: number;
    lostSpring: number;
    levelStartFull: string;
    levelMidFull: string;
    option?: 'noSeason';
    playoffRoundsWon?: number;
    playoffRoundsWonWorldsGr?: number;
    season: number;
    style?: { [key: string]: string };
    wonSpring: number;
    won: number;
}

const RecordAndPlayoffs: FC<RecordAndPlayoffsProps> = ({
    abbrev,
    lostSpring,
    lost,
    levelStartFull,
    levelMidFull,
    option,
    playoffRoundsWon,
    playoffRoundsWonWorldsGr,
    season,
    style,
    wonSpring,
    won
}) => {
    const seasonText = option !== 'noSeason' ? (
        <span>
            <a href={helpers.leagueUrl(["roster", abbrev, season])}>{season}</a>:
        </span>
    ) : null;

    let recordText;
    if (g.gameType === 7) {
        recordText = (
            <a href={helpers.leagueUrl(["standings", season])}>
                {wonSpring}-{lostSpring},&nbsp;{levelStartFull},&nbsp;{won}-{lost},&nbsp;{levelMidFull}
            </a>
        );
    } else if (g.gameType === 6) {
        recordText = (
            <a href={helpers.leagueUrl(["standings", season])}>
                {wonSpring}-{lostSpring},&nbsp;&nbsp;{won}-{lost}&nbsp;
            </a>
        );
    } else {
        recordText = (
            <a href={helpers.leagueUrl(["standings", season])}>
                {won}-{lost}
            </a>
        );
    }

    const extraText = (playoffRoundsWon !== undefined && (playoffRoundsWon >= 0 || playoffRoundsWonWorldsGr >= 0)) ? (
        <span>
            , <a href={helpers.leagueUrl(["playoffs", season])}>
                {helpers.roundsWonText(playoffRoundsWon, playoffRoundsWonWorldsGr).toLowerCase()}
            </a>
        </span>
    ) : null;

    return (
        <span style={style}>
            {seasonText}
            {recordText}
            {extraText}
        </span>
    );
};

export default RecordAndPlayoffs;
