import requests, sys
from itertools import permutations
import grequests
import concurrent.futures

def create_name_permutations():
    new_names = []

    first_name = input("first name? ")
    last_name = input("last name? ")
    dob = input("year of birth? ")

    new_names.append(permutations( [first_name, last_name]))
    new_names.append(permutations( [first_name[0], last_name]))
    new_names.append(permutations( [first_name, last_name[0]]))
    new_names.append(permutations( [first_name, last_name, dob]))
    new_names.append(permutations( [first_name[0], last_name, dob]))
    new_names.append(permutations( [first_name, last_name[0], dob]))

    gen_perm = []
    for i in range(len(new_names)):
        gen_perm.extend(list(map("".join, new_names[i])))

    return gen_perm

def main():

    names = list(sys.argv[1:])

    if len(sys.argv) == 1:
        print("usage: python3 whoareyou [name name name etc]", file=sys.stderr)
        sys.exit() 
    elif sys.argv[1] in ['personal', '-p']:
        names.pop()
        names.extend(create_name_permutations())

    green = "\033[92m"
    red = "\033[91m"
    endc = "\033[0m"
    ul = "\033[4m"

    green_checkmark = green + "\u2713" + endc
    red_x = red + "\u2717" + endc

    print(" snooping around..." + '\n')

    for name in names:
        urls = [
                ("reddit: ", "https://www.reddit.com/user/" + name),
                ("twitter: ", "https://twitter.com/" + name),
                ("instagram: ", "https://instagram.com/" + name),
                ("facebook: ", "https://facebook.com/" + name),
                ("youtube: ", "https://youtube.com/" + name),
                ("imgur: ", "https://imgur.com/" + name),
                ]

        rs = [grequests.get(u[1]) for u in urls]
        responses = grequests.map(rs)

        if len(responses) > 1:
            print( "i found this for", name, ":")
            
        for i in range(len(responses)):
            if responses[i].status_code == 200:
                print('\t', urls[i][0], '\t', green_checkmark, '\t', urls[i][1])
            #else:
            #    print('\t', urls[i][0], '\t', red_x)

    print('\n' + "done.")

if __name__ == '__main__':
    main()


