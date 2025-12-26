# strictlydapp
My prototype dApp for a decentralized music streaming platform.

## Deploy till Ethereum Sepolia (testnet)

### 1) Sätt env-variabler (i projektroten)
- `SEPOLIA_RPC_URL`: din Sepolia RPC (t.ex. från Alchemy/Infura)
- `PRIVATE_KEY`: privatnyckeln till kontot som har Sepolia ETH (eller använd `SEPOLIA_PRIVATE_KEY`)
- (valfritt) `ETHERSCAN_API_KEY`: för verifiering
- (valfritt) `MONTHLY_FEE_ETH`: default är `0.01`

### 2) Deploy
Kör:
- `npx hardhat run scripts/deploy.js --network sepolia`

Spara kontraktsadressen som skrivs ut.

### 3) Frontend: peka på rätt kontrakt + chain
Frontend läser från Vite-env. Skapa t.ex. `frontend/.env.local` och sätt:
- `VITE_STRICTLY_CONTRACT_ADDRESS=0x...`
- `VITE_NETWORK_CHAIN_ID=11155111`
- `VITE_NETWORK_NAME=Ethereum Sepolia`

### 4) (Valfritt) Verifiera kontrakt
Deploy-scriptet skriver ut exakt verify-kommando, t.ex.:
- `npx hardhat verify --network sepolia <address> "<constructorArg>"`
1) Project idea summary
My thesis project, Strictly, aims to develop a prototype of a decentralized music
streaming platform that enables automatic, transparent, and direct royalty payments
to creators without intermediaries, allowing fans to support their favorite artists
directly.
On current market-dominant music streaming platforms, independent artists cannot
upload music on their own and need to rely on third-party distributors. These
distributors either charge annual fees or take a percentage of the artist’s streaming
Page 2 of 11
revenue in exchange for handling metadata, delivery, rights management, and payouts.
This model creates unnecessary financial friction for small or emerging creators, who
often lose a considerable portion of their potential earnings before their music even
reaches listeners.
Strictly’s main goal is to address this issue by allowing creators to publish their work
and receive direct payments from streams via their digital wallets, while also
encouraging collaboration through verifiable on-chain credits and offering fans a way
to support artists more transparently. My fictional client, Musikerförbundet is a
Swedish musicians’ organization, and in this made-up scenario they are interested in
implementing Strictly to provide their members with a trustworthy and automated
solution for publishing music and managing royalties and collaborations.
2) Target audience
Strictly targets independent musicians, producers, composers, and rights holders who
seek fair, transparent, and automated royalty distribution, as well as music fans and
listeners who recognize the challenges their favorite artists face and want their
contributions to be distributed more efficiently. By providing on-chain verification of
credits and automated payments, Strictly reduces disputes, decreases administrative
workload, and gives creators greater control over their earnings.
3) Goal of your product/project
The expected outcome of Strictly’s six-week prototype is a dApp combining frontend,
smart contracts, and carefully considered UI/UX design.
Users can register, connect their wallet, and pay a monthly subscription. During the
month, the platform tracks each user’s listening habits, and at the end of the period,
their subscription is automatically distributed to the artists and rights holders they
listened to, proportionally to the amount of streams.
Creators can upload music tracks, define royalty splits among rights holders, and
receive payments automatically based on individual user listening patterns.
In this six-week version, there are no actual audio files uploaded; instead, the platform
uses a mock product to symbolize audio tracks. In the future, the platform can expand
to allow listeners to save favorite tracks, browse recommendations, and view detailed
Page 3 of 11
reports showing how their subscription contributions were allocated. The prototype
demonstrates a practical, user-friendly system for fair and transparent music
streaming, where fans directly support the artists they listen to the most.
4) Tech stack
The frontend uses HTML & CSS, React, JavaScript, and TypeScript. The blockchain layer
leverages Ethereum with Solidity smart contracts, deployed and tested using Hardhat,
and integrated via Ethers.js and Foundry. I will also test my smart contracts in Remix.
UI/UX design is prototyped in Canva and possibly Figma, and all code is documented
with inline comments and setup instructions to support future deployment and user
guidance. I document my work and day-to-day tasks in Google Drive Documents. In the
end, I provide an elaborate README in my repository describing the platform in detail,
including a user guide. If there is time, I implement a backend with Node.js and
MongoDB to handle some functions off-chain, for example indexing metadata or
caching track lists.
5) Technical flow
See visuals for both user experience and user interface below. On the first page, the
orange text symbolizes features that are not required in the six-week prototype.
When a creator uploads a song, they define metadata and assign wallet addresses for
all rights holders. Once the song is published, subscribed listeners can play the track
freely. At the end of the subscription period, the listener’s total payment is
automatically distributed proportionally to all artists and rights holders they listened
to, based on each track’s share of their listening activity. Payments are sent directly to
the creators’ and rights holders’ wallets via smart contracts.
Page 4 of 11
Page 5 of 11
6) Legal considerations
Legal considerations for Strictly primarily concern copyright and licensing compliance.
The platform must ensure that all uploaded music is either owned by the uploader or
properly licensed, and that copyrighted material belonging to labels is not uploaded
without permission. To support this, I will implement mandatory confirmation steps
where users must explicitly verify ownership or licensing before submitting music. In
the future, this can be expanded to include required upload agreements and identity
verification for creators. Clear and comprehensive Terms of Service should outline user
responsibilities as well as the consequences of infringement.
Because Strictly handles financial transactions, the platform must (before market
release) integrate KYC verification for users receiving payouts and implement AML
procedures to prevent misuse. Collaboration with copyright lawyers, collecting
societies and licensing experts will help ensure that all policies and systems align with
current legal standards and industry practices.
7) References
The idea for Strictly grew out of my own firsthand difficulties with publishing self-
produced music on streaming platforms. I have also researched methods and platforms
that have already been explored in this area.
Ujo Music and Imogen Heap’s Mycelia project aimed to give artists greater control by
using on-chain metadata and automated royalty payments. Although the vision was
pioneering, the experiment struggled to attract users and ultimately revealed the
challenges of bringing music fully on-chain.
There are also several smaller projects experimenting with decentralized music
streaming. One example is Audius (http://audius.co/). On Audius, artists have direct
control over their tracks and earn rewards through the blockchain. The platform uses a
built-in “Artist Token Rewards” system based on metrics such as weekly top artists,
top playlists, top API developers, and node operators, known collectively as the Audius
Reward Program. Rewards are paid out automatically via smart contracts.
Activity and time plan
I used Github Projects where the size of a task is defined XS – L. The system matches
the Story Points like so:
Page 6 of 11
XS: 1 SP ≈ 0,5 of work
S: 3 SP ≈ 1 day of work (aim to have tasks the size of this)
M: 5 SP ≈ ½ week of work
L: 8 SP ≈ 1 week of work
See the screenshot of my Github Projects Kanban board (I had to edit a picture of it in
Canva, so the quality wasn’t compromised).
Page 7 of 11
The following is an overview:
Week/sprints Focus for sprint Week 1, sprint 1
December 1st
- 5th
Planning & starting up Objective
- Finish planning &
writing my project
plan (5 SP)
Page 8 of 11
Week 2, sprint 2
December 8th
-12th
Week 3, sprint 3
December 15th
– 19th
Week 4, sprint 4
December 22th
– 26th
Week 5, sprint 5
December 29th
– 2th
Smart Contract structuring
and deployment
Frontend basics Frontend & Smart Contract
integration
Finish loose ends, overall
viewing and refining,
report writing
- After my project has
been approved, set
up Github Repo and
initialize React
frontend (5 SP)
- Create smart
contract with title
hash, metadata, list
of rights holders
and their wallets,
functions for
“percentage
payments” (5 SP)
- Deploy (5 SP)
- Make designs (5 SP)
- All UI & UX
implemented (5 SP)
- Ingegrate so all
buttons and
functionality aligns
with smart contract.
(5 SP)
- Make integration &
end-to-end-tests (5
SP)
- Finish loose ends
and ensure product
is viable (5 SP)
- Write and complete
Project Report (5
SP)
- Turn in my Github
repo link as well as
written report on
December 30th
.
Page 9 of 11
Week 6, sprint 6
December 5th
– 8th
Report writing & reflection - Write and create
Petcha Kutcha
presentation, as
well as product
demo (8 SP)
Function analysis & technical breakdown
I’ve divided all the functions in my prototype dApp for Strictly into four sections: the
functions for creators, the functions for listeners, the functions operated by the smart
contracts, and what functions the backend would handle if I have time to implement
them:
Creator Functions:
• Wallet connection: Creators connect their Web3 wallet like any user. All users
can act as both listeners and creators.
• Upload track metadata: Creators enter information such as track title, artists,
genre, release date, and assign wallets for royalty recipients.
• Define royalty splits: Creators allocate percentages to different rights holders,
which are stored on-chain in smart contracts.
• Publish track: The track becomes available to listeners; it is added to the
creator’s track list and tracked for listeners’ monthly subscription allocations.
Listener Functions:
• Wallet connection: Users connect their Web3 wallet to the platform.
• Pay monthly subscription: Users add funds (ETH, stablecoins, or other supported
currencies) to their “Strictly balance” as a subscription payment.
• Stream track: Users play tracks during the subscription period. Each track is
recorded to calculate the proportion of listening per artist.
• Royalty distribution: At the end of the subscription period, smart contracts
automatically distribute the user’s total payment to artists and rights holders
proportionally based on the listener’s activity.
Page 10 of 11
Smart Contract Functions:
• Track registry: Store metadata and wallet addresses for each track.
• Payment handling: Manage subscription allocation and distribute funds
automatically to multiple wallets according to listening percentages.
• Royalty split verification: Ensure all payouts follow the percentages defined by
the creator.
Optional Backend Functions:
• Metadata storage and indexing: Backend can store track metadata and cache
smart contract data for faster UI rendering.
• Track browsing and filtering: Provide users with lists of tracks, genres, and
search functionality.
Technical Flow:
1. 2. 3. 4. 5. Creator uploads track metadata and defines royalty wallets; the data is saved
on-chain.
Track becomes available in the platform UI, displayed with metadata.
Listener connects wallet and pays a monthly subscription; funds are stored in
the internal Strictly balance.
Listener streams tracks during the subscription period; smart contract records
listening proportions.
At the end of the period, smart contract automatically distributes funds to
creators and rights holders based on each listener’s activity.
Expected End Result:
The final prototype demonstrates a working decentralized streaming model where
creators can publish tracks, define royalty splits, and receive automatic payouts based
on listener activity, while listeners pay a subscription that is fairly and transparently
distributed. The prototype provides a clear user experience and showcases the
benefits of transparency, automation, and direct fan-to-artist payments in a
decentralized system.