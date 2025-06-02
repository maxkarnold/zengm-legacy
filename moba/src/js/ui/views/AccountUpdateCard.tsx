import { useEffect, useState } from 'react';
import { STRIPE_PUBLISHABLE_KEY, fetchWrapper } from '../../common';
import { getScript, realtimeUpdate, setTitle } from '../util';

const AJAX_ERROR_MSG = "Error connecting to server. Check your Internet connection or try again later.";

interface AccountUpdateCardProps {
    goldCancelled: boolean;
    expMonth: number;
    expYear: number;
    last4: string;
    username?: string;
}

interface FormState {
    disabled: boolean;
    formError: string | null;
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
}

const AccountUpdateCard = ({ goldCancelled, expMonth, expYear, last4, username }: AccountUpdateCardProps) => {
    const [formState, setFormState] = useState<FormState>({
        disabled: true,
        formError: null,
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: '',
    });

    useEffect(() => {
        const initializeStripe = async () => {
            if (!window.Stripe) {
                await getScript('https://js.stripe.com/v2/');
                window.Stripe.setPublishableKey(STRIPE_PUBLISHABLE_KEY);
            }

            setFormState(prev => ({
                ...prev,
                disabled: false,
            }));
        };

        initializeStripe();
    }, []);

    const handleChange = (name: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({
            ...prev,
            [name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setFormState(prev => ({
            ...prev,
            disabled: true,
        }));

        window.Stripe.card.createToken({
            number: formState.number,
            cvc: formState.cvc,
            exp_month: formState.exp_month,
            exp_year: formState.exp_year,
        }, async (status, response) => {
            if (response.error) {
                setFormState(prev => ({
                    ...prev,
                    disabled: false,
                    formError: response.error.message,
                }));
            } else {
                const token = response.id;

                try {
                    const data = await fetchWrapper({
                        url: `//account.basketball-gm.${window.tld}/gold_card_update.php`,
                        method: 'POST',
                        data: {
                            sport: "basketball",
                            token,
                        },
                        credentials: 'include',
                    });
                    realtimeUpdate(["account"], "/account", {goldResult: data});
                } catch (err) {
                    console.error(err);
                    setFormState(prev => ({
                        ...prev,
                        disabled: false,
                        formError: AJAX_ERROR_MSG,
                    }));
                }
            }
        });
    };

    setTitle('Update Card');

    let errorMessage: string | undefined;
    if (!username) {
        errorMessage = 'Log in to view this page.';
    }
    if (goldCancelled) {
        errorMessage = 'Cannot update card because your Basketball GM Gold account is cancelled.';
    }
    if (errorMessage) {
        return (
            <div>
                <h1>Error</h1>
                <p>{errorMessage}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Update Card</h1>

            <h3>Saved Card Info</h3>
            <p>
                Last 4 Digits: {last4}<br />
                Expiration: {expMonth}/{expYear}
            </p>

            <hr />

            <p>To replace your saved card with a new one, fill out this form:</p>

            <form onSubmit={handleSubmit}>
                {formState.formError && (
                    <div className="alert alert-danger">{formState.formError}</div>
                )}

                <div style={{maxWidth: '300px'}}>
                    <div className="form-group">
                        <label htmlFor="card-number">Card Number</label>
                        <input
                            type="text"
                            onChange={handleChange('number')}
                            value={formState.number}
                            id="card-number"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group" style={{maxWidth: '100px'}}>
                        <label htmlFor="cvc">CVC</label>
                        <input
                            type="text"
                            onChange={handleChange('cvc')}
                            value={formState.cvc}
                            id="cvc"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exp-month">Expiration (MM/YYYY)</label>
                        <div className="row">
                            <div className="col-xs-5">
                                <input
                                    type="text"
                                    onChange={handleChange('exp_month')}
                                    value={formState.exp_month}
                                    placeholder="MM"
                                    id="exp-month"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-xs-7">
                                <input
                                    type="text"
                                    onChange={handleChange('exp_year')}
                                    value={formState.exp_year}
                                    placeholder="YYYY"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={formState.disabled}
                        className="btn btn-primary"
                    >
                        Update Card
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountUpdateCard;
