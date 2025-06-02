import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { SPORT, STRIPE_PUBLISHABLE_KEY, fetchWrapper } from '../../common';
import { emitter, getScript, realtimeUpdate, setTitle } from '../util';

const AJAX_ERROR_MSG = "Error connecting to server. Check your Internet connection or try again later.";

// Types
interface StripeButtonProps {
    email: string;
}

interface StripeHandler {
    open: (options: {
        name: string;
        description: string;
        amount: number;
        email: string;
        allowRememberMe: boolean;
        panelLabel: string;
    }) => void;
}

interface UserInfoProps {
    goldUntilDateString: string;
    showGoldActive: boolean;
    showGoldCancelled: boolean;
    username?: string;
}

interface Achievement {
    count: number;
    desc: string;
    name: string;
}

interface AccountProps {
    achievements: Achievement[];
    email?: string;
    goldMessage?: string;
    goldSuccess?: boolean;
    goldUntilDateString: string;
    showGoldActive: boolean;
    showGoldCancelled: boolean;
    showGoldPitch: boolean;
    username?: string;
}

// Components
const StripeButton = ({ email }: StripeButtonProps) => {
    const [handler, setHandler] = useState<StripeHandler | null>(null);

    useEffect(() => {
        // This is legacy payment code for Stripe (Gold Subscription)
        // TODO: Update this with new api code from https://docs.stripe.com/api/products
        // const initializeStripe = async () => {
        //     if (!window.StripeCheckout) {
        //         await getScript('https://checkout.stripe.com/checkout.js');
        //     }

        //     if (!handler) {
        //         const stripeHandler = window.StripeCheckout.configure({
        //             key: STRIPE_PUBLISHABLE_KEY,
        //             image: '/ico/icon128.png',
        //             token: async token => {
        //                 try {
        //                     const data = await fetchWrapper({
        //                         url: `//account.basketball-gm.${window.tld}/gold_start.php`,
        //                         method: 'POST',
        //                         data: {
        //                             sport: "basketball",
        //                             token: token.id,
        //                         },
        //                         credentials: 'include',
        //                     });
        //                     realtimeUpdate(["account"], "/account", {goldResult: data});
        //                 } catch (err) {
        //                     console.log(err);
        //                     realtimeUpdate(["account"], "/account", {goldResult: {
        //                         success: false,
        //                         message: AJAX_ERROR_MSG,
        //                     }});
        //                 }
        //             },
        //         });
        //         setHandler(stripeHandler);
        //     }
        // };

        // initializeStripe();
    }, [handler]);

    const handleClick = () => {
        if (handler) {
            handler.open({
                name: 'Basketball GM Gold',
                description: '',
                amount: 500,
                email,
                allowRememberMe: false,
                panelLabel: "Subscribe for $5/month",
            });
        }
    };

    return (
        <button
            className="btn btn-lg btn-primary"
            disabled={!handler}
            onClick={handleClick}
        >
            Sign Up for Basketball GM Gold
        </button>
    );
};

const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();

    const result = window.confirm("Are you sure you want to cancel your Basketball GM Gold subscription?");

    if (result) {
        try {
            const data = await fetchWrapper({
                url: `//account.basketball-gm.${window.tld}/gold_cancel.php`,
                method: 'POST',
                data: {
                    sport: "basketball",
                },
                credentials: 'include',
            });
            realtimeUpdate(["account"], "/account", {goldResult: data});
        } catch (err) {
            console.error(err);
            realtimeUpdate(["account"], "/account", {goldResult: {
                success: false,
                message: AJAX_ERROR_MSG,
            }});
        }
    }
};

const UserInfo = ({ goldUntilDateString, showGoldActive, showGoldCancelled, username }: UserInfoProps) => {
    const [logoutError, setLogoutError] = useState<string | undefined>(undefined);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLogoutError(undefined);

        try {
            await fetchWrapper({
                url: `//account.basketball-gm.${window.tld}/logout.php`,
                method: 'POST',
                data: {sport: SPORT},
                credentials: 'include',
            });

            emitter.emit('updateTopMenu', {username: ''});
            realtimeUpdate(["account"], "/");
        } catch (err) {
            console.error(err);
            setLogoutError(AJAX_ERROR_MSG);
        }
    };

    return (
        <div>
            {!username ? (
                <p>
                    You are not logged in! <a href="/account/login_or_register">Click here to log in or create an account.</a> If you have an account, your achievements will be stored in the cloud, combining achievements from leagues in different browsers and different computers.
                </p>
            ) : (
                <p>
                    Logged in as: <b>{username}</b> (<a href="" id="logout" onClick={handleLogout}>Logout</a>)
                </p>
            )}
            {logoutError && <p className="text-danger">{logoutError}</p>}
            {showGoldActive && (
                <p>
                    Basketball GM Gold: Active, renews for $5 on {goldUntilDateString}
                    (<a href="/account/update_card">Update card</a> or <a href="" id="gold-cancel" onClick={handleCancel}>cancel</a>)
                </p>
            )}
            {showGoldCancelled && (
                <p>Basketball GM Gold: Cancelled, expires {goldUntilDateString}</p>
            )}
        </div>
    );
};

const GoldPitch = ({ email, username }: { email?: string; username?: string }) => (
    <div>
        <h2>Basketball GM Gold</h2>
        <div className="row">
            <div className="col-lg-8 col-md-10">
                <p>
                    Basketball GM is completely free. There will never be any
                    <a href="http://en.wikipedia.org/wiki/Freemium" rel="noopener noreferrer" target="_blank">"freemium"</a> or
                    <a href="http://en.wikipedia.org/wiki/Free-to-play" rel="noopener noreferrer" target="_blank">"pay-to-win"</a> bullshit here.
                    Why? Because if a game charges you money for power-ups, the developer makes more money if they make their game frustratingly annoying to play without power-ups.
                    Because of this, <b>freemium games always suck</b>.
                </p>

                <p>
                    If you want to support Basketball GM continuing to be a non-sucky game, sign up for Basketball GM Gold!
                    It's only <b>$5/month</b>. What do you get? More like, what don't you get? You get no new features,
                    no new improvements, no new anything. Just <b>no more ads</b>. That's it. Why? For basically the same reason
                    I won't make Basketball GM freemium. I don't want the free version to become a crippled advertisement for the pay version.
                    If you agree that the world is a better place when anyone anywhere can play Basketball GM, sign up for Basketball GM Gold today!
                </p>

                {!username ? (
                    <p>
                        <a href="/account/login_or_register">Log in or create an account</a> to sign up for Basketball GM Gold.
                    </p>
                ) : (
                    <p><StripeButton email={email} /></p>
                )}
            </div>
        </div>
    </div>
);

const AchievementList = ({ achievements }: { achievements: Achievement[] }) => (
    <ul className="achievements list-group">
        {achievements.map((achievement, i) => {
            const lis = [
                <li key={i} className="list-group-item col-xs-12 col-sm-6 col-md-4 col-lg-3 pull-left">
                    <div className={classNames({
                        'list-group-item-success': achievement.count > 0,
                        'text-muted': achievement.count === 0
                    })}>
                        {achievement.count > 1 && (
                            <span className="badge pull-right">{achievement.count}</span>
                        )}
                        <h4 className="list-group-item-heading">{achievement.name}</h4>
                        <p className="list-group-item-text">{achievement.desc}</p>
                    </div>
                </li>
            ];

            if (i % 4 === 3) {
                lis.push(<li key={`clear-lg-${i}`} className="clearfix visible-lg" />);
            }
            if (i % 3 === 2) {
                lis.push(<li key={`clear-md-${i}`} className="clearfix visible-md" />);
            }
            if (i % 2 === 1) {
                lis.push(<li key={`clear-sm-${i}`} className="clearfix visible-sm" />);
            }
            return lis;
        })}
    </ul>
);

const Account = ({
    achievements,
    email,
    goldMessage,
    goldSuccess,
    goldUntilDateString,
    showGoldActive,
    showGoldCancelled,
    showGoldPitch,
    username,
}: AccountProps) => {
    setTitle('Account');

    return (
        <div>
            {showGoldPitch && <GoldPitch email={email} username={username} />}
            <h1>Achievements</h1>
            <AchievementList achievements={achievements} />
        </div>
    );
};

export default Account;
