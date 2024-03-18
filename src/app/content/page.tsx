import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const url1 = "https://drive.google.com/file/d/1qNc67wEIU1QoJRcv1KqA68-2ATVtf8vw/view?usp=drive_link" 
const url2 = "https://drive.google.com/file/d/1KD7p1_5nVzzGWsSeH9zSvZcHZuzN2ZTp/view?usp=drive_link"

const Content: React.FC = () => {
        const [currentTrack, setCurrentTrack] = useState<string | null>(null);

        const handleTrackClick = (track: string) => {
                setCurrentTrack(track);
        };

        return (
                <div>
                    <h1>Imagery Page</h1>
                    <div>
                        <h2>Track List</h2>
                        <ul>
                            <li onClick={() => handleTrackClick(url1)}>Track 1</li>
                            <li onClick={() => handleTrackClick(url2)}>Track 2</li>
                            {/* <li onClick={() => handleTrackClick('url_of_track_3')}>Track 3</li> */}
                        </ul>
                    </div>
                    <div>
                        <h2>Player</h2>
                        {currentTrack && (
                            <>
                                <p>Now playing: {currentTrack}</p>
                                <ReactPlayer url={currentTrack} controls={true} height="50px" width="100%" config={{ file: { attributes: { poster: "ImageURL" } } }}/>
                            </>
                        )}
                    </div>
                </div>
            );
};

export default Content;