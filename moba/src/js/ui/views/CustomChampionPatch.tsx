import { useEffect } from 'react';
import { setTitle } from '../util';
import { NewWindowLink } from '../components';

const CustomChampions: React.FC = () => {
    useEffect(() => {
        setTitle('Overview');
    }, []);

    return (
        <div>
            <h1>Customization <NewWindowLink parts={[]} /></h1>
            <h2>Customization</h2>
            <p>
                MOBA GM is a highly customizable game. Most of this is done through <b>League Files</b>,
                which contain the data of a MOBA GM league - teams, players, stats, etc. League Files have two main purposes:
            </p>
            <ol>
                <li>
                    They allow you to use League Files created by others.
                    You might find some of these <a href="https://www.reddit.com/r/ZenGMLOL/search?q=roster&restrict_sr=on">on Reddit</a>.
                </li>
                <li>
                    They allow you to make a copy of a league you are playing.
                    This allows you to have a backup of a league or to share a league across two computers.
                    Within any league, go to "Tools {'>'} Export League" to create a League File.
                </li>
            </ol>

            <p>To use a League File, upload it when you <a href="http://mobagm.zengm.com/new_league">create a new league</a>.</p>
            <p>
                It is also possible to import only a prospect class, only team info (cities, names, etc), only champion patch data, and champion/champion patch data from a League File.
                For prospect classes this is done at the Players {'>'} Prospects. For team info, go to Tools {'>'} Edit Team Info (only available after enabling God Mode).
                For champion patch data, go to Tools {'>'} Edit Champion Patch (only available after enabling God Mode).
                For champion data, go to Tools {'>'} Edit Champion Info (only available after enabling God Mode).
            </p>

            <h3>Editing League Files</h3>
            <p>League Files are text files in <a href="https://en.wikipedia.org/wiki/Json">JSON</a> format. You can add/remove/edit nearly any part of it.</p>
            <p>
                The easiest way to see what a League File looks like is to create one for one of your leagues.
                Within a league, go to Tools {'>'} Export League. That will bring you to a page that allows you to select which components you want to export.
                Note that you don't have to export everything, and that default values will be filled in for components that are not included in the League File.
            </p>
            <p>
                What components should you include in your League File? It depends on your goal.
                If you want an exact copy of a specific league, you should select everything (except possibly Box Scores, since they take up a lot of space).
                If you want to create some customized rosters for others to use, you probably should just define the teams and the players, and then leave out most of the rest so their default values are used.
            </p>
            <p>
                What is the best way to edit a League File? I'm not exactly sure. You can open them in any text editor and edit them by hand.
                Another way is to use <a href="http://l.faziodev.org/bbgm-custom-rosters"><b>this cool spreadsheet template</b></a> created by <a href="http://www.reddit.com/r/BasketballGM/comments/33vkjq/v12_of_the_basketball_gm_roster_template_available/">MFazio23</a>.
            </p>

            <p>
                League Files are divided into multiple sections, which are the root elements of the JSON data structure.
                These sections are described below. Most are relatively simple and self-explanatory if you just look at an exported League File.
                Some are a bit more complicated and have links to more comprehensive information.
                The most important ones are <code>players</code>, <code>teams</code>, <code>champions</code> and <code>championPatch</code>.
            </p>

            <ul>
                <li><code>players</code> - Player attributes, ratings, and stats.</li>
                <li><code>teams</code> - Team attributes and stats.</li>
                <li><code>champions</code> - List of champion including synergy, counter, and early/mid/late data.</li>
                <li><code>championPatch</code> - How strong each champion is in that patch for each role.</li>
            </ul>

            <p>
                There are also a number of other sections, most of which you would leave completely out of a League File you plan on sharing with others.
                They mainly define the internal state of your current specific league.
            </p>

            <ul>
                <li><code>gameAttributes</code> - Mostly internal variables that should be left alone, but some might be interesting to tweak. <a href="/manual/customization/game-attributes/">More information.</a></li>
                <li><code>releasedPlayers</code> - List of players who have been released from their contracts but still count against the salary cap.</li>
                <li><code>awards</code> - Offseason awards, such as MVP.</li>
                <li><code>schedule</code> - Remaining scheduled games for the current season.</li>
                <li><code>playoffSeries</code> - Playoff matchups and results for each prior season.</li>
                <li><code>trade</code> - State of the current trade negotiation.</li>
                <li><code>negotiations</code> - State of the current contract negotiations. There can only be one entry here at a time, except when re-signing your own players in the offseason.</li>
                <li><code>messages</code> - Messages from the owner.</li>
                <li><code>events</code> - Past events viewable from Tools {'>'} Event Log.</li>
                <li><code>games</code> - Box score data from past games. This can get quite large, so it often makes sense to leave it off.</li>
            </ul>

            <h3>Debugging League Files</h3>
            <p>Debugging can be tricky. Ultimately, the only way to be sure is to try it out. Testing after every change can help isolate bugs.</p>
        </div>
    );
};

export default CustomChampions;
