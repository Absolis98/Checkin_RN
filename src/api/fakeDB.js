// export default checkinDB = {
//   pets: {
//     Pet1: {
//       id: 0,
//       name: 'Atom',
//       type: 'Cat',
//       breed: 'Snow Shoe',
//       sex: 'male',
//       age: 3,
//       weight: 15,
//       isPregnant: false,
//       color: 'white',
//       picture: 'picture',
//     },
//     Pet2: {
//       id: 1,
//       name: 'Mimi',
//       type: 'Dog',
//       breed: 'mix',
//       sex: 'female',
//       age: 10,
//       weight: 10,
//       isPregnant: false,
//       color: 'black',
//       picture: 'picture',
//     },
//     Pet3: {
//       id: 2,
//       name: 'Pink',
//       type: 'Cat',
//       breed: 'mix',
//       sex: 'female',
//       age: 3,
//       weight: 15,
//       isPregnant: false,
//       color: 'white-brown-grey',
//       picture: 'picture',
//     },
//     Pet4: {
//       id: 1,
//       name: 'Layla',
//       type: 'Dog',
//       breed: 'yorkie',
//       sex: 'female',
//       age: 10,
//       weight: 10,
//       isPregnant: false,
//       color: 'black',
//       picture: 'picture',
//     },
//   },
//   owners: {
//     Owner1: {
//       id: 0,
//       name: 'Abraham Solis',
//     },
//     Owner2: {
//       id: 1,
//       name: 'Farid Solis',
//     },
//   },
//   groups: {
//     group1: {
//       name: 'home',
//       id: 0,
//       owners: {
//         owner1: checkinDB.owners.Owner1.id,
//         owner2: checkinDB.owners.Owner2.id,
//       },
//       pets: {
//         pet1: checkinDB.pets.Pet1.id,
//         pet2: checkinDB.pets.Pet2,
//       },
//     },
//     group2: {
//       name: 'notHome',
//       id: 1,
//       owners: {
//         owner1: checkinDB.owners.Owner1.id,
//         owner2: checkinDB.owners.Owner2.id,
//       },
//       pets: {
//         pet3: checkinDB.pets.Pet3,
//         pet4: checkinDB.pets.Pet4,
//       },
//     },
//   },
// };
export default checkinDB = {
  pets: {
    Pet1: {
      id: 0,
      name: 'Atom',
      type: 'Cat',
      breed: 'Snow Shoe',
      sex: 'male',
      age: 3,
      weight: 15,
      isPregnant: false,
      color: 'white',
      picture: 'picture',
      actions: {
        essential: {
          action1: {
            name: 'Feed',
            isDone: false,
          },
          action2: {
            name: 'Water',
            isDone: false,
          },
        },
        todo: {
          action1: {
            name: 'Clean Litterbox',
            isDone: false,
          },
          action2: {
            name: 'Play',
            isDone: false,
          },
          action3: {
            name: 'Walk',
            isDone: false,
          },
          action4: {
            name: 'Groom',
            isDone: false,
          },
          action5: {
            name: 'Trim Nails',
            isDone: false,
          },
        },
        medical: {
          action1: {
            name: 'Flea Medicine',
            isDone: false,
          },
          action2: {
            name: 'Heart-Worm Medicine',
            isDone: false,
          },
        },
      },
    },
    Pet2: {
      id: 1,
      name: 'Mimi',
      type: 'Dog',
      breed: 'mix',
      sex: 'female',
      age: 10,
      weight: 10,
      isPregnant: false,
      color: 'black',
      picture: 'picture',
      actions: {
        essential: {
          action1: {
            name: 'Feed',
            isDone: false,
          },
          action2: {
            name: 'Water',
            isDone: false,
          },
        },
        todo: {
          action1: {
            name: 'Clean Litterbox',
            isDone: false,
          },
          action2: {
            name: 'Play',
            isDone: false,
          },
          action3: {
            name: 'Walk',
            isDone: false,
          },
          action4: {
            name: 'Groom',
            isDone: false,
          },
          action5: {
            name: 'Trim Nails',
            isDone: false,
          },
        },
        medical: {
          action1: {
            name: 'Flea Medicine',
            isDone: false,
          },
          action2: {
            name: 'Heart-Worm Medicine',
            isDone: false,
          },
        },
      },
    },
    Pet3: {
      id: 2,
      name: 'Pink',
      type: 'Cat',
      breed: 'mix',
      sex: 'female',
      age: 3,
      weight: 15,
      isPregnant: false,
      color: 'white-brown-grey',
      picture: 'picture',
      actions: {
        essential: {
          action1: {
            name: 'Feed',
            isDone: false,
          },
          action2: {
            name: 'Water',
            isDone: false,
          },
        },
        todo: {
          action1: {
            name: 'Clean Litterbox',
            isDone: false,
          },
          action2: {
            name: 'Play',
            isDone: false,
          },
          action3: {
            name: 'Walk',
            isDone: false,
          },
          action4: {
            name: 'Groom',
            isDone: false,
          },
          action5: {
            name: 'Trim Nails',
            isDone: false,
          },
        },
        medical: {
          action1: {
            name: 'Flea Medicine',
            isDone: false,
          },
          action2: {
            name: 'Heart-Worm Medicine',
            isDone: false,
          },
        },
      },
    },
    Pet4: {
      id: 1,
      name: 'Layla',
      type: 'Dog',
      breed: 'yorkie',
      sex: 'female',
      age: 10,
      weight: 10,
      isPregnant: false,
      color: 'black',
      picture: 'picture',
      actions: {
        essential: {
          action1: {
            name: 'Feed',
            isDone: false,
          },
          action2: {
            name: 'Water',
            isDone: false,
          },
        },
        todo: {
          action1: {
            name: 'Clean Litterbox',
            isDone: false,
          },
          action2: {
            name: 'Play',
            isDone: false,
          },
          action3: {
            name: 'Walk',
            isDone: false,
          },
          action4: {
            name: 'Groom',
            isDone: false,
          },
          action5: {
            name: 'Trim Nails',
            isDone: false,
          },
        },
        medical: {
          action1: {
            name: 'Flea Medicine',
            isDone: false,
          },
          action2: {
            name: 'Heart-Worm Medicine',
            isDone: false,
          },
        },
      },
    },
  },
  owners: {
    Owner1: {
      id: 0,
      name: 'Abraham Solis',
    },
    Owner2: {
      id: 1,
      name: 'Farid Solis',
    },
  },
  groups: {
    group1: {
      name: 'home',
      id: 0,
      owners: {
        Owner1: {
          id: 0,
          name: 'Abraham Solis',
        },
        Owner2: {
          id: 1,
          name: 'Farid Solis',
        },
      },
      pets: {
        Pet1: {
          id: 0,
          name: 'Atom',
          type: 'Cat',
          breed: 'Snow Shoe',
          sex: 'male',
          age: 3,
          weight: 15,
          isPregnant: false,
          color: 'white',
          picture: 'picture',
          actions: {
            essential: {
              action1: {
                name: 'Feed',
                isDone: false,
              },
              action2: {
                name: 'Water',
                isDone: false,
              },
            },
            todo: {
              action1: {
                name: 'Clean Litterbox',
                isDone: false,
              },
              action2: {
                name: 'Play',
                isDone: false,
              },
              action3: {
                name: 'Walk',
                isDone: false,
              },
              action4: {
                name: 'Groom',
                isDone: false,
              },
              action5: {
                name: 'Trim Nails',
                isDone: false,
              },
            },
            medical: {
              action1: {
                name: 'Flea Medicine',
                isDone: false,
              },
              action2: {
                name: 'Heart-Worm Medicine',
                isDone: false,
              },
            },
          },
        },
        Pet2: {
          id: 1,
          name: 'Mimi',
          type: 'Dog',
          breed: 'mix',
          sex: 'female',
          age: 10,
          weight: 10,
          isPregnant: false,
          color: 'black',
          picture: 'picture',
          actions: {
            essential: {
              action1: {
                name: 'Feed',
                isDone: false,
              },
              action2: {
                name: 'Water',
                isDone: false,
              },
            },
            todo: {
              action1: {
                name: 'Clean Litterbox',
                isDone: false,
              },
              action2: {
                name: 'Play',
                isDone: false,
              },
              action3: {
                name: 'Walk',
                isDone: false,
              },
              action4: {
                name: 'Groom',
                isDone: false,
              },
              action5: {
                name: 'Trim Nails',
                isDone: false,
              },
            },
            medical: {
              action1: {
                name: 'Flea Medicine',
                isDone: false,
              },
              action2: {
                name: 'Heart-Worm Medicine',
                isDone: false,
              },
            },
          },
        },
      },
    },
    group2: {
      name: 'notHome',
      id: 1,
      owners: {
        Owner1: {
          id: 0,
          name: 'Abraham Solis',
        },
        Owner2: {
          id: 1,
          name: 'Farid Solis',
        },
      },
      pets: {
        Pet3: {
          id: 2,
          name: 'Pink',
          type: 'Cat',
          breed: 'mix',
          sex: 'female',
          age: 3,
          weight: 15,
          isPregnant: false,
          color: 'white-brown-grey',
          picture: 'picture',
          actions: {
            essential: {
              action1: {
                name: 'Feed',
                isDone: false,
              },
              action2: {
                name: 'Water',
                isDone: false,
              },
            },
            todo: {
              action1: {
                name: 'Clean Litterbox',
                isDone: false,
              },
              action2: {
                name: 'Play',
                isDone: false,
              },
              action3: {
                name: 'Walk',
                isDone: false,
              },
              action4: {
                name: 'Groom',
                isDone: false,
              },
              action5: {
                name: 'Trim Nails',
                isDone: false,
              },
            },
            medical: {
              action1: {
                name: 'Flea Medicine',
                isDone: false,
              },
              action2: {
                name: 'Heart-Worm Medicine',
                isDone: false,
              },
            },
          },
        },
        Pet4: {
          id: 1,
          name: 'Layla',
          type: 'Dog',
          breed: 'yorkie',
          sex: 'female',
          age: 10,
          weight: 10,
          isPregnant: false,
          color: 'black',
          picture: 'picture',
          actions: {
            essential: {
              action1: {
                name: 'Feed',
                isDone: false,
              },
              action2: {
                name: 'Water',
                isDone: false,
              },
            },
            todo: {
              action1: {
                name: 'Clean Litterbox',
                isDone: false,
              },
              action2: {
                name: 'Play',
                isDone: false,
              },
              action3: {
                name: 'Walk',
                isDone: false,
              },
              action4: {
                name: 'Groom',
                isDone: false,
              },
              action5: {
                name: 'Trim Nails',
                isDone: false,
              },
            },
            medical: {
              action1: {
                name: 'Flea Medicine',
                isDone: false,
              },
              action2: {
                name: 'Heart-Worm Medicine',
                isDone: false,
              },
            },
          },
        },
      },
    },
  },
};
