import * as React from 'react';
const Loader: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <span className="loader"></span>
        </div>
    );
};
export default Loader;
