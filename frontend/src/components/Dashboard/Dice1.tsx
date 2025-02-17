import React, { useMemo, useCallback } from 'react';
export default function Dice1() {

    return (

        <div className="dice-div">
            <div className="individual">
                <ol className="die-list even-roll0" data-roll="1" id="die-1">
                    <li className="die-item" data-side="1">
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="2">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="3">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="4">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="5">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="6">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                </ol>
            </div>
            <div className="individual">
                <ol className="die-list even-roll1" data-roll="1" id="die-2">
                    <li className="die-item" data-side="1">
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="2">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="3">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="4">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="5">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                    <li className="die-item" data-side="6">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </li>
                </ol>
            </div>
        </div>

    )
}

