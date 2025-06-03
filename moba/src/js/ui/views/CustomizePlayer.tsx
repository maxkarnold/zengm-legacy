import * as faces from 'facesjs';
import React, { useState, useEffect } from 'react';
import { PHASE, g, helpers } from '../../common';
import { realtimeUpdate, setTitle, toWorker } from '../util';
import { NewWindowLink, PlayerPicture } from '../components';
import type { Player, PlayerRatings } from '../../common/types';

const positions = ["TOP", "JGL", "MID", "ADC", "SUP"];
const country = ["United States","Korea","China", "Taiwan", "Canada","Dominican Republic","Mexico","Austria","Armenia", "Belgium", "Bulgaria","Croatia","Czech Republic", "Denmark", "England", "Estonia", "France","Finland","Germany", "Greece", "Hungary","Iceland","Ireland","Italy","Netherlands", "Norway","Portugal", "Poland", "Romania", "Scotland","Serbia", "Spain", "Sweden","Switzerland","Latvia","Slovenia","Slovakia", "Russia","Ukraine", "Brazil", "Japan", "Australia","New Zealand", "Colombia", "Costa Rica", "Ecuador", "Panama", "Peru", "Puerto Rico", "Venezuela", "Argentina", "Chile", "Paraguay", "Uruguay","Israel","Turkey","Iraq","Iran","Syria","United Arab Emirates","South Africa","Indonesia","Malaysia","Philippines","Singapore", "Thailand","Vietnam"];
const region = ["NA","EU","KR", "CN","TW","BR","CIS","JP","LatAm","OCE", "SEA","TR"];
const languagesFirst = ["English","Korean","Chinese","Spanish","German","French","Italian","Romanian","Greek","Armenian","Bulgarian","Dutch","Polish", "Danish","Finnish","Swedish","Hungarian","Norwegian","Icelandic","Russian","Czech","Portuguese","Croatian","Serbian","Slovak","Slovenian","Filipino","Indonesian","Japanese","Malay","Thai","Vietnamese","Turkish","Persian","Arabic"];
const languagesRest = ["","English","Korean","Chinese","Spanish","German","French","Italian","Romanian","Greek","Armenian","Bulgarian","Dutch","Polish", "Danish","Finnish","Swedish","Hungarian","Norwegian","Icelandic","Russian","Czech","Portuguese","Croatian","Serbian","Slovak","Slovenian","Filipino","Indonesian","Japanese","Malay","Thai","Vietnamese","Turkish","Persian","Arabic"];

// Get face options from facesjs
const faceOptions = faces.svgs;
const facePaths = faces.svgsIndex;

interface CustomizePlayerProps {
    ovrOption?: 'ratings' | 'OVR';
    appearanceOption?: 'Cartoon Face' | 'Image URL';
    godMode: boolean;
    originalTid?: number;
    p?: Player;
    season: number;
    teams: Array<{
        text: string;
        tid: number;
    }>;
}

const copyValidValues = (source: any, target: Player, season: number) => {
    for (const attr of ['hgt', 'tid', 'weight']) {
        const val = parseInt(source[attr], 10);
        if (!isNaN(val)) {
            target[attr] = val;
        }
    }

    target.firstName = source.firstName;
    target.userID = source.userID;
    target.lastName = source.lastName;
    target.imgURL = source.imgURL;

    {
        const age = parseInt(source.age, 10);
        if (!isNaN(age)) {
            target.born.year = g.season - age;
        }
    }

    target.born.loc = source.born.loc;

    target.born.country = source.born.country;

///    target.languages = source.languages;
//    target.languages[0] = source.languages[0];
	{
		const r = source.ratings.length - 1;

		target.languages[0] = source.language1;
		target.ratings[r].languages[0] = source.language1;

		target.languages[1] = source.language2;
//		if (source.language2 == undefined) {
			//target.ratings[r].languages.pop(1);
		//} else {
			target.ratings[r].languages[1] = source.language2;
		//}

		target.languages[2] = source.language3;
		//if (source.language3 == undefined) {
			//target.ratings[r].languages.pop(2);
		//} else {
			target.ratings[r].languages[2] = source.language3;
		//}
		//target.ratings[r].languages[2] = source.language3;

		target.languages[3] = source.language4;
		//if (source.language4 == undefined) {
		//	target.ratings[r].languages.pop(3);
		//} else {
		target.ratings[r].languages[3] = source.language4;

	//	target.ratings[r].region = source.region;
		//}

	}


    target.college = source.college;

    {
        const diedYear = parseInt(source.diedYear, 10);
        if (!isNaN(diedYear)) {
            target.diedYear = diedYear;
        } else {
            target.diedYear = null;
        }
    }


	// this doesn't work? what does? need to keep testing. it prevents it from saving
  //  {
    //    const language1 = source.languages[0];
      //  target.language[0] = language1;
    //}

    {
        // Allow any value, even above or below normal limits, but round to $10k and convert from M to k
        let amount = Math.round(100 * parseFloat(source.contract.amount)) * 10;
        if (isNaN(amount)) {
            amount = g.minContract;
        }
        target.contract.amount = amount;
    }

    {
        let exp = parseInt(source.contract.exp, 10);
        if (!isNaN(exp)) {
            // No contracts expiring in the past
            if (exp < season) {
                exp = season;
            }

            // If current season contracts already expired, then current season can't be allowed for new contract
            if (exp === season && g.phase >= g.PHASE.RESIGN_PLAYERS) {
                exp += 1;
            }

            target.contract.exp = exp;
        }
    }

    {
        let gamesRemaining = parseInt(source.injury.gamesRemaining, 10);
        if (isNaN(gamesRemaining) || gamesRemaining < 0) {
            gamesRemaining = 0;
        }
        target.injury.gamesRemaining = gamesRemaining;
    }

    target.injury.type = source.injury.type;

    {
        const r = source.ratings.length - 1;
        for (const rating of Object.keys(source.ratings[r])) {
            if (rating === 'pos') {
                target.ratings[r].pos = source.ratings[r].pos;
            } else if (['blk', 'dnk', 'drb', 'endu', 'fg', 'ft', 'hgt', 'ins', 'jmp', 'pot', 'pss', 'reb', 'spd', 'stl', 'stre', 'tp','ovr'].includes(rating)) {
                const val = helpers.bound(parseInt(source.ratings[r][rating], 10), 0, 100);
                if (rating === 'ovr' && target.ratings[r][rating] !== val) {
                    target.ratings[r].oldOVR = 1;
                } else if (rating === 'ovr') {
                    target.ratings[r].oldOVR = 0;
                }

                if (!isNaN(val)) {
                    target.ratings[r][rating] = val;
                }
            }
        }
    }

    // These are already normalized, cause they are selects
    for (const attr of ['ear', 'eyebrow', 'eye', 'faceform', 'haircut', 'mouth', 'nose', 'glasses']) {
        target.face.partials[attr] = source.face.partials[attr];
    }

    target.face.colors.skinColor = source.face.colors.skinColor;
    target.face.colors.hairColor = source.face.colors.hairColor;
};

const CustomizePlayer: React.FC<CustomizePlayerProps> = ({
    ovrOption = 'ratings',
    appearanceOption = 'Cartoon Face',
    godMode,
    originalTid,
    p: initialPlayer,
    season,
    teams
}) => {
    const [player, setPlayer] = useState<Player | undefined>(() => {
        if (initialPlayer) {
            const p = helpers.deepCopy(initialPlayer);
            p.age = season - p.born.year;
            p.contract.amount /= 1000;
            p.language1 = p.languages?.[0];
            if (p.languages?.length > 1) p.language2 = p.languages[1];
            if (p.languages?.length > 2) p.language3 = p.languages[2];
            if (p.languages?.length > 3) p.language4 = p.languages[3];
            return p;
        }
        return undefined;
    });
    const [saving, setSaving] = useState(false);
    const [currentAppearanceOption, setAppearanceOption] = useState(appearanceOption);
    const [currentOvrOption, setOvrOption] = useState(ovrOption);

    useEffect(() => {
        const title = originalTid === undefined ? 'Create Player' : 'Edit Player';
        setTitle(title);
    }, [originalTid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!player) return;

        setSaving(true);
        const p = helpers.deepCopy(player);
        copyValidValues(player, p, season);

        if (currentAppearanceOption !== "Image URL") {
            p.imgURL = "";
        }

        const pid = await toWorker('upsertCustomizedPlayer', p, originalTid, season, currentOvrOption);
        realtimeUpdate([], helpers.leagueUrl(["player", pid]));
    };

    const handleChange = (type: string, field: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!player) return;

        const val = e.target.value;
        const newPlayer = { ...player };

        if (type === 'root') {
            (newPlayer as any)[field] = val;
        } else if (['born', 'contract', 'injury'].includes(type)) {
            (newPlayer as any)[type][field] = val;
        } else if (type === 'stats') {
            newPlayer.stats[newPlayer.stats.length - 1][field] = val;
        } else if (type === 'rating') {
            newPlayer.ratings[newPlayer.ratings.length - 1][field] = val;
        } else if (type === 'face' && newPlayer.face) {
            if (['ear', 'eyebrow', 'eye', 'faceform', 'haircut', 'mouth', 'nose', 'glasses'].includes(field)) {
                if (!val) {
                    console.error("Error while submitting the player form! ", "Type: ", type, ' Field: ', field, ' Value: ', val);
                    return;
                }
                newPlayer.face.partials[field] = val;
            } else if (field === 'skinColor' || field === 'hairColor') {
                newPlayer.face.colors[field] = val;
            }
        }

        setPlayer(newPlayer);
    };

    const randomizeFace = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!player) return;

        const generatedFace = faces.generate();
        const face: Player['face'] = {
            partials: {
                ear: generatedFace.ear.id,
                eyebrow: generatedFace.eyebrow.id,
                eye: generatedFace.eye.id,
                faceform: generatedFace.head.id,
                haircut: generatedFace.hair.id,
                mouth: generatedFace.mouth.id,
                nose: generatedFace.nose.id,
                glasses: generatedFace.glasses.id
            },
            colors: {
                skinColor: generatedFace.body.color,
                hairColor: generatedFace.hair.color
            }
        };
        setPlayer({ ...player, face });
    };

    const renderFaceOptions = () => {
        if (!player) return null;

        return (
            <div className="row">
                <div className="col-xs-6 form-group">
                    <label>Ear</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'ear')} value={player.face?.partials.ear}>
                        {Object.keys(faceOptions.ear).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Eyebrow</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'eyebrow')} value={player.face?.partials.eyebrow}>
                        {Object.keys(faceOptions.eyebrow).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Eye</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'eye')} value={player.face?.partials.eye}>
                        {Object.keys(faceOptions.eye).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Faceform</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'faceform')} value={player.face?.partials.faceform}>
                        {Object.keys(faceOptions.head).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Haircut</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'haircut')} value={player.face?.partials.haircut}>
                        {Object.keys(faceOptions.hair).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Mouth</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'mouth')} value={player.face?.partials.mouth}>
                        {Object.keys(faceOptions.mouth).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Nose</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'nose')} value={player.face?.partials.nose}>
                        {Object.keys(faceOptions.nose).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>

                <div className="col-xs-6 form-group">
                    <label>Glasses</label>
                    <select className="form-control" onChange={handleChange.bind(null, 'face', 'glasses')} value={player.face?.partials.glasses}>
                        {Object.keys(faceOptions.glasses).map(val => <option key={val} value={val}>{val}</option>)}
                    </select>
                </div>
            </div>
        );
    };

    if (!player) {
        return <div>Loading...</div>;
    }

    const r = player.ratings.length - 1;

    let ovrDiv = null;

    if (currentOvrOption === 'ratings') {
		  ovrDiv =      <div className="row">
                        <div className="col-xs-4">
                            <h3>Mental</h3>
                            <div className="form-group">
                                <label>Adaptability</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'hgt')} value={player.ratings[r].hgt} />
                            </div>
                            <div className="form-group">
                                <label>Fortitude</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'stre')} value={player.ratings[r].stre} />
                            </div>
                            <div className="form-group">
                                <label>Consistency</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'spd')} value={player.ratings[r].spd} />
                            </div>
                            <div className="form-group">
                                <label>Team Player</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'jmp')} value={player.ratings[r].jmp} />
                            </div>
                            <div className="form-group">
                                <label>Leadership</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'endu')} value={player.ratings[r].endu} />
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <h3>Tactical</h3>
                            <div className="form-group">
                                <label>Awareness</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'ins')} value={player.ratings[r].ins} />
                            </div>
                            <div className="form-group">
                                <label>Laning</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'dnk')} value={player.ratings[r].dnk} />
                            </div>
                            <div className="form-group">
                                <label>Team Fighting</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'ft')} value={player.ratings[r].ft} />
                            </div>
                            <div className="form-group">
                                <label>Risk Taking</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'fg')} value={player.ratings[r].fg} />
                            </div>

                        </div>
                        <div className="col-xs-4">
                            <h3>Game</h3>
                            <div className="form-group">
                                <label>Positioning</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'tp')} value={player.ratings[r].tp} />
                            </div>
                            <div className="form-group">
                                <label>Skill Shots</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'blk')} value={player.ratings[r].blk} />
                            </div>
                            <div className="form-group">
                                <label>Last Hitting</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'stl')} value={player.ratings[r].stl} />
                            </div>
                            <div className="form-group">
                                <label>Summoner Spells</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'drb')} value={player.ratings[r].drb} />
                            </div>
							<h3>Physical</h3>
                            <div className="form-group">
                                <label>Stamina</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'pss')} value={player.ratings[r].pss} />
                            </div>
                            <div className="form-group">
                                <label>Injury Prone</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'reb')} value={player.ratings[r].reb} />
                            </div>
                        </div>
                    </div>;


	} else {
        ovrDiv =   <div className="row">
                        <div className="col-xs-4">
                            <div className="form-group">
                                <label>Overall</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'ovr')}value={player.ratings[r].ovr} />
                            </div>
                        </div>
                        <div className="col-xs-8" />
                    </div>;
    }

    let pictureDiv = null;

    if (currentAppearanceOption === 'Cartoon Face') {
        pictureDiv = <div className="row">
            <div className="col-sm-4">
                <div className="face" style={{height: '300px', maxWidth: '150px'}}>
                    <PlayerPicture face={player.face} imgURL={player.imgURL} />
                </div>
                <center>
                    <button type="button" className="btn btn-default" onClick={randomizeFace}>
                        Randomize
                    </button>
                </center>
            </div>
            <div className="col-sm-8">
                <div className="row">
                    <div className="col-xs-6 form-group">
                        <label>Skin Color</label>
                        <input type="text" className="form-control" onChange={handleChange.bind(null, 'face', 'skinColor')} value={player.face.colors.skinColor} />
                    </div>
                    <div className="col-xs-6 form-group">
                        <label>Hair Color</label>
                        <input type="text" className="form-control" onChange={handleChange.bind(null, 'face', 'hairColor')} value={player.face.colors.hairColor} />
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Ear</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'ear')} value={player.face.partials.ear}>
                            {Object.keys(faceOptions.ear).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Eyebrow</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'eyebrow')} value={player.face.partials.eyebrow}>
                            {Object.keys(faceOptions.eyebrow).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Eye</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'eye')} value={player.face.partials.eye}>
                            {Object.keys(faceOptions.eye).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Faceform</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'faceform')} value={player.face.partials.faceform}>
                            {Object.keys(faceOptions.head).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>


                    <div className="col-xs-6 form-group">
                        <label>Haircut</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'haircut')} value={player.face.partials.haircut}>
                            {Object.keys(faceOptions.hair).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Mouth</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'mouth')} value={player.face.partials.mouth}>
                            {Object.keys(faceOptions.mouth).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Nose</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'nose')} value={player.face.partials.nose}>
                            {Object.keys(faceOptions.nose).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>

                    <div className="col-xs-6 form-group">
                        <label>Glasses</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'face', 'glasses')} value={player.face.partials.glasses}>
                            {Object.keys(faceOptions.glasses).map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>;
    } else {
        pictureDiv = <div className="form-group">
            <label>Image URL</label>
            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'imgURL')} value={player.imgURL} />
            <span className="help-block">Your image must be hosted externally. If you need to upload an image, try using <a href="http://imgur.com/">imgur</a>. For ideal display, crop your image so it has a 2:3 aspect ratio (such as 100px wide and 150px tall).</span>
        </div>;
    }

    return <div>
        <h1>{originalTid === undefined ? 'Create Player' : 'Edit Player'} <NewWindowLink parts={[]} /></h1>

        <p>Here, you can {originalTid === undefined ? 'create a custom player with' : 'edit a player to have'} whatever attributes and ratings you want. If you want to make a whole league of custom players, you should probably create a <a href="https://basketball-gm.com/manual/customization/">custom League File</a>.</p>

        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-7">
                    <h2>Attributes</h2>

                    <div className="row">
                        <div className="col-sm-3 form-group">
                            <label>First Name</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'firstName')} value={player.firstName} />
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>User ID</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'userID')} value={player.userID} />
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'lastName')} value={player.lastName} />
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Age</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'age')} value={player.age} />
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Team</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'root', 'tid')} value={player.tid}>
                                {teams.map(t => {
                                    return <option key={t.tid} value={t.tid}>{t.text}</option>;
                                })}
                            </select>
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Position</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'rating', 'pos')} value={player.ratings[r].pos}>
                                {positions.map(pos => {
                                    return <option key={pos} value={pos}>{pos}</option>;
                                })}
                            </select>
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Region</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'born', 'loc')} value={player.born.loc}>
                                {region.map(loc => {
                                    return <option key={loc} value={loc}>{loc}</option>;
                                })}
                            </select>
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>Country</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'born', 'country')} value={player.born.country}>
                                {country.map(country => {
                                    return <option key={country} value={country}>{country}</option>;
                                })}
                            </select>
                        </div>

                        <div className="col-sm-3 form-group">
                            <label>Language 1</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'root','language1')} value={player.language1}>
                                {languagesFirst.map(language1 => {
                                    return <option key={language1} value={language1}>{language1}</option>;
                                })}
                            </select>
                        </div>

                        <div className="col-sm-3 form-group">
                            <label>Language 2</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'root','language2')} value={player.language2}>
                                {languagesRest.map(language2 => {
                                    return <option key={language2} value={language2}>{language2}</option>;
                                })}
                            </select>
                        </div>

                        <div className="col-sm-3 form-group">
                            <label>Language 3</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'root','language3')} value={player.language3}>
                                {languagesRest.map(language3 => {
                                    return <option key={language3} value={language3}>{language3}</option>;
                                })}
                            </select>
                        </div>


                        <div className="col-sm-3 form-group">
                            <label>Language 4</label>
                            <select className="form-control" onChange={handleChange.bind(null, 'root','language4')} value={player.language4}>
                                {languagesRest.map(language4 => {
                                    return <option key={language4} value={language4}>{language4}</option>;
                                })}
                            </select>
                        </div>


                        <div className="col-sm-6 form-group">
                            <label>Contract Amount</label>
                            <div className="input-group">
                                <span className="input-group-addon">$</span>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'contract', 'amount')} value={player.contract.amount} />
                                <span className="input-group-addon">K per year</span>
                            </div>
                        </div>
                        <div className="col-sm-6 form-group">
                            <label>Contract Expiration</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'contract', 'exp')} value={player.contract.exp} />
                        </div>


                        <div className="col-sm-6 form-group">
                            <label>Year of Death (blank for alive)</label>
                            <input type="text" className="form-control" onChange={handleChange.bind(null, 'root', 'diedYear')} value={player.diedYear} />
                        </div>


                    </div>

                    <h2>Appearance</h2>

                    <div className="form-group">
                        <label>You can either create a cartoon face or specify the URL to an image.</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'appearanceOption')} style={{maxWidth: '150px'}} value={currentAppearanceOption}>
                            <option value="Cartoon Face">Cartoon Face</option>
                            <option value="Image URL">Image URL</option>
                        </select>
                    </div>

                    {pictureDiv}
                </div>

                <div className="clearfix visible-sm visible-xs" />

                <div className="col-md-5">
                    <h2>Ratings</h2>

                    <div className="form-group">
                        <label>You can either adjust ratings indvidually or just adjust the overall rating (OVR)</label>
                        <select className="form-control" onChange={handleChange.bind(null, 'currentOvrOption')} style={{maxWidth: '150px'}} value={currentOvrOption}>
                            <option value="ratings">Individual Ratings</option>
                            <option value="OVR">OVR</option>
                        </select>
                    </div>
                    <p>All ratings are on a scale of 0 to 100.</p>

                    <div className="row">
                        <div className="col-xs-4">
                            <div className="form-group">
                                <label>Potential</label>
                                <input type="text" className="form-control" onChange={handleChange.bind(null, 'rating', 'pot')}value={player.ratings[r].pot} />
                            </div>
                        </div>
                        <div className="col-xs-8" />
                    </div>

                     {ovrDiv}
                </div>
            </div>

            <br />
            <center>
                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {originalTid === undefined ? 'Create Player' : 'Edit Player'}
                </button>
            </center>
        </form>
    </div>;
};

export default CustomizePlayer;
