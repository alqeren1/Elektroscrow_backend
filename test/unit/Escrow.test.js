const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")
//sadece local chain testi
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Escrow unit tests", function () {
          let escrow,
              token,
              chainId,
              tokenAddress,
              escrowLogic,
              escrowLogicAddress
          let deployer
          let seller, escrowAddress, buyerAddress

          let amount, accounts

          //const sendValue = 1 * 10 ** 18
          beforeEach(async function () {
              // Get the account to deploy the contracts with
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              buyerAddress = deployer.address
              seller = accounts[2]
              chainId = network.config.chainId
              amount = ethers.parseUnits("1000", "ether")
              amountBuyer = ethers.parseUnits("2000", "ether")
              // Deploy all contracts using the tags specified in the deployment scripts
              await deployments.fixture(["escrow"])

              // Get the contract instances
              // ethers.getContract returns a contract instance connected to the first signer by default,
              // which is usually the deployer when using `getNamedAccounts`
              escrow = await ethers.getContract("escrow", deployer)
              escrowAddress = (await deployments.get("escrow")).address
              token = await deployments.get("testToken")
              tokenAddress = await token.address
              const Token = await ethers.getContractFactory("testToken")
              token = await Token.attach(tokenAddress)
              //console.log("Token address: " + tokenAddress)
              //console.log("Seller address: " + seller.address)
          })

          describe("Initializing escrow contract", function () {
              beforeEach(async function () {
                  const escrowFactoryTx = await escrow.escrowFactory(
                      seller.address,
                      amount,
                      tokenAddress,
                  )
                  const receipt = await escrowFactoryTx.wait()

                  // Get the address of the deployed EscrowLogic contract
                  //console.log(escrow)
                  const escrowCreatedEvents = await escrow.queryFilter(
                      escrow.filters.EscrowCreated(null, seller.address, null),
                  )
                  //console.log(escrowCreatedEvents)
                  // Ensure there is at least one event
                  assert.isNotEmpty(
                      escrowCreatedEvents,
                      "No EscrowCreated event found",
                  )

                  // Get the address of the EscrowLogic contract from the event
                  escrowLogicAddress =
                      escrowCreatedEvents[0].args.escrowContract

                  // Verify the address is not empty or zero
                  assert.isNotEmpty(
                      escrowLogicAddress,
                      "EscrowLogic address is empty",
                  )
                  assert.notEqual(
                      escrowLogicAddress,
                      "0x0",
                      "EscrowLogic address is zero",
                  )

                  // Check if the contract was successfully deployed
                  const escrowLogicContract = await ethers.getContractAt(
                      "EscrowLogic",
                      escrowLogicAddress,
                  )

                  const EscrowLogic =
                      await ethers.getContractFactory("EscrowLogic")
                  escrowLogic = await EscrowLogic.attach(escrowLogicAddress)
                  //console.log("Logic address: " + escrowLogicAddress)
              })
              it("Contract amount is correct", async function () {
                  const _amount = await escrowLogic.getAmount()
                  //await console.log("Amounts: " + amount + " " + _amount)
                  assert.equal(amount.toString(), _amount.toString())
              })
              it("Seller is correct", async function () {
                  const _seller = await escrowLogic.i_seller()
                  //await console.log("Seller: " + _seller)
                  assert.equal(_seller.toString(), seller.address.toString())
              })
              it("Buyer is correct", async function () {
                  const _buyer = await escrowLogic.i_buyer()
                  //await console.log("Buyer: " + _buyer)
                  assert.equal(_buyer.toString(), deployer.address.toString())
              })
              it("Token contract is correct", async function () {
                  const _tokenAddress = await escrowLogic.i_tokenContract()
                  //await console.log("Token contract: " + _tokenAddress)
                  assert.equal(
                      _tokenAddress.toString(),
                      tokenAddress.toString(),
                  )
              })
              it("Factory owner is correct", async function () {
                  const _owner = await escrow.s_owner()
                  //await console.log("Factory owner: " + _owner)
                  assert.equal(_owner.toString(), deployer.address.toString())
              })
              it("Successfully shows buyer,seller mappings to logic", async function () {
                  const buyerLogic = await escrow.getBuyerEscrows(
                      deployer.address,
                  )
                  const sellerLogic = await escrow.getSellerEscrows(
                      seller.address,
                  )
                  //console.log("Buyer escrow contract: " + buyerLogic)
                  assert.equal(sellerLogic[0], escrowLogicAddress)
                  assert.equal(buyerLogic[0], escrowLogicAddress)
              })
              it("Update owner reverts on public calls", async function () {
                  const connecting = await escrow.connect(accounts[3])

                  await expect(
                      connecting.updateOwner(accounts[3].address),
                  ).to.be.revertedWithCustomError(escrow, "Factory__NotOwner")
              })
              it("Updates the owner", async function () {
                  await escrow.updateOwner(seller.address)
                  const newOwner = await escrow.s_owner()

                  assert.equal(newOwner, seller.address)
              })
              it("Save ERC20 tokens", async function () {
                  const sendAmount = "1000000000000000000000"
                  const firstcontractBalance =
                      await token.balanceOf(escrowAddress)
                  // console.log("First balance: " + firstcontractBalance)
                  const send = await token.transfer(escrowAddress, sendAmount)
                  const contractBalance = await token.balanceOf(escrowAddress)

                  assert.equal(contractBalance, sendAmount)
                  const save = await escrow.rescueERC20(tokenAddress)

                  //console.log("Contract balance " + contractBalance)
                  const newBalance = await token.balanceOf(escrowAddress)
                  // console.log("new balace: " + newBalance)
                  assert.equal(newBalance.toString(), "0")
              })

              describe("Logic tests ", async function () {
                  it("Constructor arguments are correct", async function () {
                      const _buyer = await escrowLogic.i_buyer()
                      const _seller = await escrowLogic.i_seller()
                      const _amount = await escrowLogic.i_amount()
                      const _tokenContract = await escrowLogic.i_tokenContract()
                      const _factory = await escrowLogic.i_factory()
                      assert.equal(_buyer, buyerAddress)
                      assert.equal(_seller, seller.address)
                      assert.equal(_amount, amount)
                      assert.equal(_tokenContract, tokenAddress)
                      assert.equal(_factory, escrowAddress)
                  })
                  describe("Initialize function tests", async function () {
                      it("Only contributing parties can call initialize", async function () {
                          const connecting = await escrowLogic.connect(
                              accounts[3],
                          )
                          await expect(
                              connecting.initialize(),
                          ).to.be.revertedWithCustomError(
                              escrowLogic,
                              "Logic__NotInParties",
                          )
                      })
                      it("Buyer initialize ", async function () {
                          const approve = await token.approve(
                              escrowLogicAddress,
                              amountBuyer,
                          )

                          await escrowLogic.initialize()

                          const logicTokenBalance =
                              await token.balanceOf(escrowLogicAddress)
                          assert.equal(
                              logicTokenBalance.toString(),
                              amountBuyer.toString(),
                          )
                      })
                      it("Seller initialize", async function () {
                          await token.transfer(seller.address, amount)
                          const connect1 = await token.connect(seller)
                          const connect2 = await escrowLogic.connect(seller)
                          const approve = await connect1.approve(
                              escrowLogicAddress,
                              amount,
                          )
                          await connect2.initialize()
                          const logicTokenBalance =
                              await token.balanceOf(escrowLogicAddress)
                          assert.equal(
                              logicTokenBalance.toString(),
                              amount.toString(),
                          )
                      })
                      it("Buyer double initialize ", async function () {
                          const approve = await token.approve(
                              escrowLogicAddress,
                              amountBuyer,
                          )

                          await escrowLogic.initialize()

                          const logicTokenBalance =
                              await token.balanceOf(escrowLogicAddress)
                          await expect(
                              escrowLogic.initialize(),
                          ).to.be.revertedWithCustomError(
                              escrowLogic,
                              "Logic__AlreadyDeposited",
                          )
                      })
                      it("Seller double initialize", async function () {
                          await token.transfer(seller.address, amount)
                          await token.transfer(seller.address, amount)
                          const connect1 = await token.connect(seller)
                          const connect2 = await escrowLogic.connect(seller)
                          const approve = await connect1.approve(
                              escrowLogicAddress,
                              amount,
                          )
                          await connect2.initialize()
                          const logicTokenBalance =
                              await token.balanceOf(escrowLogicAddress)
                          assert.equal(
                              logicTokenBalance.toString(),
                              amount.toString(),
                          )
                          await expect(
                              connect2.initialize(),
                          ).to.be.revertedWithCustomError(
                              escrowLogic,
                              "Logic__AlreadyDeposited",
                          )
                      })
                      it("Already initialized error ", async function () {
                          const approve = await token.approve(
                              escrowLogicAddress,
                              amountBuyer,
                          )

                          await escrowLogic.initialize()

                          await token.transfer(seller.address, amount)
                          const connect1 = await token.connect(seller)
                          const connect2 = await escrowLogic.connect(seller)
                          const approve2 = await connect1.approve(
                              escrowLogicAddress,
                              amount,
                          )
                          await connect2.initialize()

                          await expect(
                              escrowLogic.initialize(),
                          ).to.be.revertedWithCustomError(
                              escrowLogic,
                              "Logic__AlreadyInitialized",
                          )
                      })
                      describe("Withdraw tests", async function () {
                          beforeEach(async function () {
                              await token.transfer(seller.address, amount)
                              const approve = await token.approve(
                                  escrowLogicAddress,
                                  amountBuyer,
                              )
                              const connect2 = await token.connect(seller)
                              const approve2 = await connect2.approve(
                                  escrowLogicAddress,
                                  amount,
                              )
                          })
                          it("Only contributing parties can call withdraw", async function () {
                              const connecting = await escrowLogic.connect(
                                  accounts[3],
                              )
                              await expect(
                                  connecting.withdraw(),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotInParties",
                              )
                          })
                          it("Buyer withdraw before init", async function () {
                              await escrowLogic.initialize()
                              const firstlogicbalance =
                                  await token.balanceOf(escrowLogicAddress)

                              await escrowLogic.withdraw()
                              const newlogicbalance =
                                  await token.balanceOf(escrowLogicAddress)

                              assert.equal(newlogicbalance.toString(), "0")
                              assert.equal(
                                  firstlogicbalance.toString(),
                                  amountBuyer,
                              )
                          })
                          it("Seller withdraw before init", async function () {
                              const connect2 = await escrowLogic.connect(seller)
                              await connect2.initialize()
                              const firstlogicbalance =
                                  await token.balanceOf(escrowLogicAddress)
                              await connect2.withdraw()
                              const newlogicbalance =
                                  await token.balanceOf(escrowLogicAddress)

                              assert.equal(newlogicbalance, "0")
                              assert.equal(firstlogicbalance, amount)
                          })

                          it("Withdraw after init", async function () {
                              const connect2 = await escrowLogic.connect(seller)
                              await connect2.initialize()
                              await escrowLogic.initialize()
                              await expect(
                                  escrowLogic.withdraw(),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotPossibleAfterInitialize",
                              )
                              await expect(
                                  connect2.withdraw(),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotPossibleAfterInitialize",
                              )
                          })
                          it("Seller recieves same tokens with deposit", async function () {
                              await token.transfer(
                                  escrowLogicAddress,
                                  amountBuyer,
                              )
                              const connect2 = await escrowLogic.connect(seller)
                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )
                              await connect2.initialize()
                              await connect2.withdraw()
                              const sellerBalanceAfter = await token.balanceOf(
                                  seller.address,
                              )
                              const logicBalance =
                                  await token.balanceOf(escrowLogicAddress)
                              assert.equal(
                                  sellerBalance,
                                  sellerBalanceAfter,
                                  amount,
                              )
                              assert.notEqual(logicBalance, "0")
                          })
                          it("Buyer recieves same tokens with deposit", async function () {
                              await token.transfer(
                                  escrowLogicAddress,
                                  amountBuyer,
                              )
                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await escrowLogic.initialize()
                              await escrowLogic.withdraw()
                              const buyerBalanceAfter =
                                  await token.balanceOf(buyerAddress)
                              const logicBalance =
                                  await token.balanceOf(escrowLogicAddress)
                              assert.equal(buyerBalance, buyerBalanceAfter)
                              assert.notEqual(logicBalance, "0")
                          })
                          it("Finish escrow test before init", async function () {
                              await expect(
                                  escrowLogic.finishEscrow(1),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotInitializedYet",
                              )
                              const connect = await escrowLogic.connect(seller)
                              await expect(
                                  connect.finishEscrow(1),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotInitializedYet",
                              )
                          })
                      })
                      describe("Finish escrow tests", async function () {
                          beforeEach(async function () {
                              await token.transfer(seller.address, amount)
                              const approve = await token.approve(
                                  escrowLogicAddress,
                                  amountBuyer,
                              )
                              const connect = await escrowLogic.connect(seller)
                              const connect2 = await token.connect(seller)
                              const approve2 = await connect2.approve(
                                  escrowLogicAddress,
                                  amount,
                              )
                              await escrowLogic.initialize()
                              await connect.initialize()
                          })
                          it("Only parties can call", async function () {
                              const connecting = await escrowLogic.connect(
                                  accounts[5],
                              )

                              await expect(
                                  connecting.finishEscrow(1),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__NotInParties",
                              )
                          })
                          it("Can't be called again after finished", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)
                              await connecting.finishEscrow(1)
                              await escrowLogic.finishEscrow(1)
                              await expect(
                                  escrowLogic.finishEscrow(1),
                              ).to.be.revertedWithCustomError(
                                  escrowLogic,
                                  "Logic__EscrowComplete",
                              )
                          })
                          it("Accept scenario successfull", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)

                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await connecting.finishEscrow(1)
                              await escrowLogic.finishEscrow(1)
                              const sellerBalance2 = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance2 =
                                  await token.balanceOf(buyerAddress)
                              assert.equal(sellerBalance, "0")
                              assert.equal(sellerBalance2, amountBuyer)
                              assert.equal(buyerBalance2, buyerBalance + amount)
                          })
                          it("Refund scenario successfull", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)

                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await connecting.finishEscrow(2)
                              await escrowLogic.finishEscrow(2)
                              const sellerBalance2 = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance2 =
                                  await token.balanceOf(buyerAddress)
                              assert.equal(sellerBalance, "0")
                              assert.equal(sellerBalance2, amount)
                              assert.equal(
                                  buyerBalance2,
                                  buyerBalance + amountBuyer,
                              )
                          })
                          it("Conflict scenario 1 successfull", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)

                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await connecting.finishEscrow(2)
                              await escrowLogic.finishEscrow(1)

                              const sellerBalance2 = await token.balanceOf(
                                  seller.address,
                              )
                              const buyerDecision =
                                  await escrowLogic.s_buyerDecision()
                              const sellerDecision =
                                  await escrowLogic.s_sellerDecision()
                              const buyerBalance2 =
                                  await token.balanceOf(buyerAddress)
                              const logicBalance =
                                  await token.balanceOf(escrowLogicAddress)

                              assert.equal(sellerBalance, "0")
                              assert.equal(sellerBalance2, "0")
                              assert.equal(buyerBalance2, buyerBalance)
                              assert.equal(logicBalance, amount.toString() * 3)
                              assert.equal(buyerDecision.toString(), "1")
                              assert.equal(sellerDecision.toString(), "2")
                          })
                          it("Conflict scenario 2 successfull", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)

                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await connecting.finishEscrow(0)
                              await escrowLogic.finishEscrow(1)

                              const sellerBalance2 = await token.balanceOf(
                                  seller.address,
                              )
                              const buyerDecision =
                                  await escrowLogic.s_buyerDecision()
                              const sellerDecision =
                                  await escrowLogic.s_sellerDecision()
                              const buyerBalance2 =
                                  await token.balanceOf(buyerAddress)
                              const logicBalance =
                                  await token.balanceOf(escrowLogicAddress)

                              assert.equal(sellerBalance, "0")
                              assert.equal(sellerBalance2, "0")
                              assert.equal(buyerBalance2, buyerBalance)
                              assert.equal(logicBalance, amount.toString() * 3)
                              assert.equal(buyerDecision.toString(), "1")
                              assert.equal(sellerDecision.toString(), "0")
                          })
                          it("Conflict scenario 3 successfull", async function () {
                              const connecting =
                                  await escrowLogic.connect(seller)

                              const sellerBalance = await token.balanceOf(
                                  seller.address,
                              )

                              const buyerBalance =
                                  await token.balanceOf(buyerAddress)
                              await connecting.finishEscrow(0)
                              await escrowLogic.finishEscrow(0)

                              const sellerBalance2 = await token.balanceOf(
                                  seller.address,
                              )
                              const buyerDecision =
                                  await escrowLogic.s_buyerDecision()
                              const sellerDecision =
                                  await escrowLogic.s_sellerDecision()
                              const buyerBalance2 =
                                  await token.balanceOf(buyerAddress)
                              const logicBalance =
                                  await token.balanceOf(escrowLogicAddress)

                              assert.equal(sellerBalance, "0")
                              assert.equal(sellerBalance2, "0")
                              assert.equal(buyerBalance2, buyerBalance)
                              assert.equal(logicBalance, amount.toString() * 3)
                              assert.equal(buyerDecision.toString(), "0")
                              assert.equal(sellerDecision.toString(), "0")
                          })
                      })
                  })
                  //-------------------------rescue dan devam--------------------------------------
                  it("emits event on enter", async function () {
                      expect(
                          await raffle.enterRaffle({
                              value: raffleEntranceFee,
                          }),
                      ).to.emit(raffle, "RaffleEnter")
                  })
                  it("doesn't accept entrance when raffle is calculating", async function () {
                      //büyük ihtimalle istek atmak için gerekli olan Lınk token olmadığı için çalışmıyor, sepoliada link ile denemek lazım
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      await network.provider.send("evm_increaseTime", [
                          Number(interval) + 1,
                      ])
                      await network.provider.send("evm_mine")
                      await raffle.performUpkeep("0x")
                      await expect(
                          raffle.enterRaffle({ value: raffleEntranceFee }),
                      ).to.be.revertedWithCustomError(raffle, "Raffle__NotOpen")
                  })
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Owner withdraws the money with a single funder", async function () {
                  //balance = await ethers.provider.getBalance(fundMe)

                  await fundMe.withdraw()
                  //const owner = await fundMe.i_owner()

                  balance = await ethers.provider.getBalance(fundMe)
                  //await console.log("Value:" + ethers.formatEther(balance))
                  assert.equal(balance.toString(), "0")
              })
              it("Owner withdraws the money with multiple getFunder", async function () {
                  const account = await ethers.getSigners()

                  for (i = 1; i < 7; i++) {
                      const connecting = await fundMe.connect(account[i])

                      await connecting.fund({ value: sendValue })
                  }

                  const ownerconnect = await fundMe.connect(deployer)

                  await ownerconnect.withdraw()
                  //balance = await ethers.provider.getBalance(fundMe)

                  //await console.log("Value:" + balance)

                  assert.equal(balance.toString(), "0")
              })
              it("Public can't withdraw the money", async function () {
                  const fundMeConnect = fundMe.connect(alienAccount)
                  //await fundMeConnect.withdraw()
                  await expect(fundMeConnect.withdraw()).to.be.reverted
              })
          })
          // Add more tests as needed
      })
