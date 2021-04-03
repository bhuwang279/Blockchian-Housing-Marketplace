pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(
      uint[2] memory a,
      uint[2][2] memory b,
      uint[2] memory c,
      uint[2] memory input
    )
    public
    view 
    returns
    (bool r);
}

import "./ERC721Mintable.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ChimToken721 {

    Verifier  verifierContract;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 solutionIndex;
        address solutionAddress;
        bool exist;
        bool usedBefore;

    }
    // TODO define an array of the above struct

    Solution [] solutions;

    // TODO define a mapping to store unique solutions submitted

    mapping(bytes32 => Solution) uniqueSolutionsSubmitted;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // TODO Create an event to emit when a solution is added

    event SolutionAdded(uint solutionIndex, address solutionAddress);


    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

     /**
    * @dev Modifier that checks if solution exist
    */

    modifier requireSolutionExistAndNotUsed(bytes32 solutionKey){
         require(uniqueSolutionsSubmitted[solutionKey].exist, "Solution should exist");
         require(!uniqueSolutionsSubmitted[solutionKey].usedBefore, "Solution should not be used before");
         _;
    }

    modifier requireSolutionDoesntExist(bytes32 solutionKey){
        require(!uniqueSolutionsSubmitted[solutionKey].exist, "Solution already exist");
        _;
    }

    /**
    * @dev Constructor
    *  
    */

    constructor(address verifierContractAddress, string memory name, string memory symbol) 
        ChimToken721(name, symbol) 
        public 
    {
        verifierContract = Verifier(verifierContractAddress);
    }


    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/


    // TODO Create a function to add the solutions to the array and emit the event

    function addSolution( uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public requireSolutionDoesntExist(getSolutionKey(input[0], input[1], msg.sender)) {

        bytes32 solutionKey = getSolutionKey(input[0], input[1], msg.sender);

        bool isValid = verifierContract.verifyTx(a,b,c, input);
        require(isValid, "Solutions is not valid");
        Solution memory solution = Solution(solutions.length,msg.sender,true, false);
        solutions.push(solution);
        uniqueSolutionsSubmitted[solutionKey] =solution;
        emit SolutionAdded(solutions.length, msg.sender);

    }




    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintNewNFT(uint a, uint b, address to) public requireSolutionExistAndNotUsed(getSolutionKey(a,b, msg.sender)) {
        bytes32 solutionKey =getSolutionKey(a,b, msg.sender);
        super.mint(to, uniqueSolutionsSubmitted[solutionKey].solutionIndex);
       uniqueSolutionsSubmitted[solutionKey].usedBefore = true;
    }

    function getSolutionKey(uint a, uint b , address sender) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, sender));

    }


}

  


























