import requests, sys
import grequests
import concurrent.futures

if len(sys.argv) == 1:
    print("usage: python3 whoareyou [name name name etc]", file=sys.stderr)
    sys.exit() 

names = sys.argv[1:] 


green = "\033[92m"
red = "\033[91m"
endc = "\033[0m"
ul = "\033[4m"

green_checkmark = green + "\u2713" + endc
red_x = red + "\u2717" + endc

#def whois(name):
#    urls = [
#            ("reddit: ", "https://www.reddit.com/user/" + name),
#            ("twitter: ", "https://twitter.com/" + name),
#            ("instagram: ", "https://instagram.com/" + name),
#            ("facebook: ", "https://facebook.com/" + name),
#            ("youtube: ", "https://youtube.com/" + name),
#            ("imgur: ", "https://imgur.com/" + name),
#            ]
#    data = []
#    data.append('\n' + "who is " + ul + green + name + endc + '\n')
#    rs = [grequests.get(u[1]) for u in urls]
#    responses = grequests.map(rs)
#
#    for i in range(len(responses)):
#        if responses[i].status_code == 200:
#            data.append('\t' + urls[i][0] + '\t' + green_checkmark + '\t' + urls[i][1])
#        else:
#           data.append('\t' + urls[i][0] + '\t' + red_x)
#
#    return '\n'.join(data)
#
#with concurrent.futures.ThreadPoolExecutor(max_workers=len(names)) as e:
#    future_to_data = {e.submit(whois,name)): name for name in names}
#    for future in concurrent.futures.as_completed(future_to_data):
#        print(future.result())

for name in names:
    urls = [
            ("reddit: ", "https://www.reddit.com/user/" + name),
            ("twitter: ", "https://twitter.com/" + name),
            ("instagram: ", "https://instagram.com/" + name),
            ("facebook: ", "https://facebook.com/" + name),
            ("youtube: ", "https://youtube.com/" + name),
            ("imgur: ", "https://imgur.com/" + name),
            ]

    print('\n' + "who is ", ul, green, name, endc, '\n')
    rs = [grequests.get(u[1]) for u in urls]
    responses = grequests.map(rs)

    for i in range(len(responses)):
        if responses[i].status_code == 200:
            print('\t', urls[i][0], '\t', green_checkmark, '\t', urls[i][1])
        else:
            print('\t', urls[i][0], '\t', red_x)

print('\n' + "done.")


