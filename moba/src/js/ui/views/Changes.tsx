import {setTitle} from '../util';
import {NewWindowLink, SafeHtml} from '../components';
import PropTypes from 'prop-types';

const Changes = ({changes}: {changes: {date: string, msg: string}[]}) => {
    setTitle('Changes');

    return <div>
        <h1>Changes <NewWindowLink /></h1>

        <ul>
            {changes.map((c, i) => {
                return <li key={i}>
                    <b>{c.date}</b>: <SafeHtml dirty={c.msg} />
                </li>;
            })}
        </ul>

        <p>Data only goes back to April 26, 2018. Only relatively significant user-facing changes are listed here, so you won't get bugged for every little new feature.</p>
    </div>;
};
Changes.propTypes = {
    changes: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        msg: PropTypes.string.isRequired,
    })),
};

export default Changes;
