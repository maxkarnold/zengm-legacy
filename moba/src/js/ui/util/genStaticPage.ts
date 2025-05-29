import {initView, setTitle} from '.';

const genStaticPage = (name: string, title: string, content: React.ReactElement, inLeague: boolean) => {
    return initView({
        id: name,
        inLeague,
        Component: () => {
            setTitle(title);

            return content;
        },
    });
};

export default genStaticPage;
