import { useEffect, useState } from 'react';
import { g, helpers } from '../../common';
import { logEvent, setTitle, toWorker } from '../util';

interface ChampionPatch {
    cpid: number;
    champion: string;
    role: string;
    rank: number;
}

interface Props {
    godMode: boolean;
    teams: any[];
    championPatch: ChampionPatch[];
}

const EditChampionPatch = (props: Props) => {
    const [saving, setSaving] = useState(false);
    const [championPatch, setChampionPatch] = useState<ChampionPatch[]>(props.championPatch);

    useEffect(() => {
        setTitle('Champion Patch Info');
    }, []);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (event) => {
            try {
                const patch = JSON.parse(event.target?.result as string);
                const newPatch = patch.championPatch;

                // Validate patch data
                for (let i = 0; i < newPatch.length; i++) {
                    if (i !== newPatch[i].cpid) {
                        console.error(`CHAMPION PATCH ERROR: Wrong cpid, champion patch ${i}`);
                        return;
                    }

                    if (newPatch[i].cpid < 0) {
                        console.error("ROSTER ERROR: Invalid cpid, champion " + i);
                        return;
                    }

                    if (newPatch[i].rank < 0) {
                        console.error("ROSTER ERROR: Invalid champion rank, champion " + i);
                        return;
                    }

                    if (typeof newPatch[i].champion !== "string") {
                        console.error("ROSTER ERROR: Invalid name, champion " + i);
                        return;
                    }
                }

                await toWorker('updateChampionPatch', newPatch);
                setChampionPatch(newPatch);

                logEvent({
                    type: 'success',
                    text: 'New champion patch info successfully loaded.',
                    saveToDb: false,
                });
            } catch (error) {
                console.error('Error loading champion patch:', error);
            }
        };
    };

    const handleInputChange = (i: number, name: keyof ChampionPatch, e: React.ChangeEvent<HTMLInputElement>) => {
        const newChampionPatch = [...championPatch];
        newChampionPatch[i] = {
            ...newChampionPatch[i],
            [name]: e.target.value
        };
        setChampionPatch(newChampionPatch);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await toWorker('updateChampionPatch', championPatch);
            logEvent({
                type: 'success',
                text: 'Saved champion patch info.',
                saveToDb: false,
            });
        } catch (error) {
            console.error('Error saving champion patch:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!props.godMode) {
        return (
            <div>
                <h1>Error</h1>
                <p>You can't edit champion patch info unless you enable <a href={helpers.leagueUrl(["god_mode"])}>God Mode</a></p>
            </div>
        );
    }

    return (
        <div>
            <h1>Edit Champion Patch Info</h1>

            <p>You can manually edit champion patch strength below or you can upload a champion patch file to specify all of the champion info at once. Uploading also allows you to add or subtract as many roles as you want for uploading into new leagues.</p>

            <h2>Upload Champion Patch File</h2>

            <p>The JSON file format is described in <a href="http://basketball-gm.com/manual/customization/teams/">the manual</a>. You can also <a href="http://zengm.com/files/championPatchMOBA.json">download</a> the starting champion patch file to make changes for uploading. In leagues with changing champion patch data go to Tools &gt; Export for the current patch data.</p>

            <p className="text-danger">Warning: selecting a valid champion patch file will instantly apply the new champion patch info to your league.</p>

            <p><input type="file" onChange={handleFile} /></p>

            <h2>Manual Editing</h2>

            <div className="row hidden-xs" style={{fontWeight: 'bold', marginBottom: '0.5em'}}>
                <div className="col-sm-4">
                    <br />Name
                </div>
                <div className="col-sm-4">
                    <br />Role
                </div>
                <div className="col-sm-4">
                    <br />Patch Level (1.00=best)
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    {championPatch.map((cp, i) => (
                        <div key={cp.cpid}>
                            <div className="col-xs-6 col-sm-4 form-group">
                                <label className="visible-xs">Organization</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={e => handleInputChange(i, 'champion', e)}
                                    value={cp.champion}
                                />
                            </div>
                            <div className="col-xs-6 col-sm-4 form-group">
                                <label className="visible-xs">Short Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={e => handleInputChange(i, 'role', e)}
                                    value={cp.role}
                                />
                            </div>
                            <div className="col-xs-6 col-sm-4 form-group">
                                <label className="visible-xs">Abbrev</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={e => handleInputChange(i, 'rank', e)}
                                    value={cp.rank}
                                />
                            </div>
                            <hr className="visible-xs" />
                        </div>
                    ))}
                </div>
                <center>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        Update Champion Patch Info
                    </button>
                </center>
            </form>
        </div>
    );
};

export default EditChampionPatch;
