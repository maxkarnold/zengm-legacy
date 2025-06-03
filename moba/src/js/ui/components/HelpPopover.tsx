import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import PropTypes from 'prop-types';

const HelpPopover = ({children, placement, style, title}: {
    children: string | React.ReactElement | React.ReactElement[],
    placement?: 'bottom' | 'left' | 'right' | 'top',
    style: {[key: string]: number | string},
    title: string,
}) => {
    const popover = (
        <Popover id={title} title={title}>
            {children}
        </Popover>
    );

    return <OverlayTrigger trigger="click" rootClose placement={placement} overlay={popover}>
        <span className="glyphicon glyphicon-question-sign help-icon" style={style} />
    </OverlayTrigger>;
};

HelpPopover.propTypes = {
    children: PropTypes.any,
    placement: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
};

export default HelpPopover;
