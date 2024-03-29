// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _nftsSold;
  Counters.Counter private _nftCount;
  uint256 public LISTING_FEE = 0.0001 ether;
  address payable private _marketOwner;
  mapping(uint256 => NFT) private _idToNFT;

  struct NFT {
    uint256 tokenId;
    address nftContract;
    address payable seller;
    address payable owner;
    uint256 price;
    bool listed;
  }

  event NFTListed (
    address nftContract,
    address seller,
    address owner,
    uint256 price,
    uint256 tokenId
  );

  event NFTSold (
    address nftContract,
    address seller,
    address owner,
    uint256 price,
    uint256 tokenId
  );

  constructor () {
    _marketOwner = payable(msg.sender);
  }

  function listNft(address _nftContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

    _nftCount.increment();

    _idToNFT[_tokenId] = NFT(
      _tokenId,
      _nftContract,
      payable(msg.sender),
      payable(address(this)),
      _price,
      true
    );

    emit NFTListed(
      _nftContract,
      payable(msg.sender),
      payable(address(this)),
      _price,
      _tokenId
    );
  }

  function buyNft(address _nftContract, uint256 _tokenId) public payable nonReentrant {
    NFT storage nft = _idToNFT[_tokenId];
    require(msg.value >= nft.price, "Not enough ether to cover asking price");

    address payable buyer = payable(msg.sender);
    payable(nft.seller).transfer(msg.value);
    IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
    _marketOwner.transfer(LISTING_FEE);
    nft.owner = buyer;
    nft.listed = false;

    _nftsSold.increment();
    emit NFTSold(_nftContract, nft.seller, buyer, msg.value, nft.tokenId);
  }

  function resellNft(address _nftContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

    NFT storage nft = _idToNFT[_tokenId];

    nft.seller = payable(msg.sender);
    nft.owner = payable(address(this));
    nft.listed = true;
    nft.price = _price;

    _nftsSold.decrement();
    emit NFTListed(
      _nftContract,
      payable(msg.sender),
      payable(address(this)),
      _price,
      _tokenId
    );
  }

  function getListingFee() public view returns (uint256) {
    return LISTING_FEE;
  }

  function getListedNfts() public view returns (NFT[] memory) {
    uint256 nftCount = _nftCount.current();
    uint256 unsoldNftsCount = nftCount - _nftsSold.current();

    NFT[] memory nfts = new NFT[](unsoldNftsCount);
    uint nftsIndex = 0;

    for (uint i =0;i<nftCount;i++) {
      if(_idToNFT[i+1].listed) {
        nfts[nftsIndex] = _idToNFT[i+1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myNftCount = 0;

    for (uint i = 0; i < nftCount; i++) {
      if (_idToNFT[i+1].owner == msg.sender) {
        myNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myNftCount);
    uint nftsIndex = 0;

    for (uint i=0; i< nftCount; i++) {
      if (_idToNFT[i+1].owner == msg.sender) {
        nfts[nftsIndex] = _idToNFT[i+1];
        nftsIndex++;
      }
    }
    return nfts;
  }

  function getMyListedNfts() public view returns (NFT[] memory) {
    uint nftCount = _nftCount.current();
    uint myListedNftCount = 0;

    for ( uint i =0; i < nftCount; i++) {
      if(_idToNFT[i+1].seller == msg.sender && _idToNFT[i+1].listed) {
        myListedNftCount++;
      }
    }

    NFT[] memory nfts = new NFT[](myListedNftCount);
    uint nftsIndex = 0;

    for(uint i =0; i < nftCount; i++) {
      if(_idToNFT[i+1].seller == msg.sender && _idToNFT[i+1].listed) {
        nfts[nftsIndex] = _idToNFT[i+1];
        nftsIndex++;
      }
    }
    return nfts;
  }
}
