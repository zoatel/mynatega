# -*- coding: utf-8 -*-

import requests
import bs4
import csv
import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate('mynatega-firebase.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

final_result = []
stats = []
subject_name = []
data5 = {}
data6 = {}



def init_cookies(url):
    result = requests.get(url)
    result.encoding = 'windows-1256'
    return result.cookies

def get_urls(nOfPages,cookies):
    urls = []
    for i in range(nOfPages):
        page = requests.get(f'http://app1.helwan.edu.eg/FaslBU/EngHelwan/HasasnUpMlist.asp?start={1+i*20}', cookies=cookies)
        page.encoding = 'windows-1256'
        apage = pd.read_html(page.text)
        nOflinks = len(apage[6][8])-2
        soup = bs4.BeautifulSoup(page.text,"lxml",exclude_encodings=["windows-1256"])
        soup.decode("windows-1256")
        name_result = soup.find_all("a",href = True)
        for i in range(nOflinks):
            urls.append(name_result[9+i]['href'])
    return urls

def claim_student(url):
    result = requests.get(f'http://app1.helwan.edu.eg/FaslBU/EngHelwan/{url}')
    result.encoding = 'windows-1256'
    soup = bs4.BeautifulSoup(result.text,"lxml",exclude_encodings=["windows-1256"])
    soup.decode("windows-1256")
    name_result = soup.find_all("font",{'size':'5'})
    degree_result = soup.find_all("font",{'size':'4'})
    stud_name = name_result[5].getText()
    seating_number = name_result[7].getText()
    subject_name.append(degree_result[3].getText())
    subject_1_degree = degree_result[5].getText()
    subject_name.append(degree_result[11].getText())
    subject_2_degree = degree_result[13].getText()
    subject_name.append(degree_result[19].getText())
    subject_3_degree = degree_result[21].getText()
    subject_name.append(degree_result[27].getText())
    subject_4_degree = degree_result[29].getText()
    subject_name.append(degree_result[35].getText())
    subject_5_degree = degree_result[37].getText()
    subject_name.append(degree_result[43].getText())
    subject_6_degree = degree_result[45].getText()
    subject_name.append(degree_result[59].getText())
    subject_7_degree = degree_result[61].getText()
    subject_name.append(degree_result[67].getText())
    subject_8_degree = degree_result[69].getText()
    subject_name.append(degree_result[75].getText())
    subject_9_degree = degree_result[77].getText()
    subject_name.append(degree_result[7].getText())
    subject_10_degree = degree_result[9].getText()
    subject_name.append(degree_result[15].getText())
    subject_11_degree = degree_result[17].getText()
    subject_name.append(degree_result[23].getText())
    subject_12_degree = degree_result[25].getText()   
    final_result.append({"ST.NO.":seating_number,
                         "ST.Name":stud_name,
                         subject_name[0]:subject_1_degree,
                         subject_name[1]:subject_2_degree,
                         subject_name[2]:subject_3_degree,
                         subject_name[3]:subject_4_degree,
                         subject_name[4]:subject_5_degree,
                         subject_name[5]:subject_6_degree,
                         subject_name[6]:subject_7_degree,
                         subject_name[7]:subject_8_degree,
                         subject_name[8]:subject_9_degree,
                         subject_name[9]:subject_10_degree,
                         subject_name[10]:subject_11_degree,
                         subject_name[11]:subject_12_degree})
    print(f"student No. {name_result[7].getText()} claimed")

def save_res(urls):
    for i in urls:
        claim_student(i)
    keys = final_result[0].keys()
    with open('scraped.csv', 'w', encoding='utf-8-sig', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(final_result)
        print("file created")


def calculate_statistics(directory,nOfSubject):
    df = pd.read_csv (directory,encoding='utf-8')
    full_grade = [100,150,150,150,150,50,150,150,150,150,100,50]
    for i in range(nOfSubject):
        maxOfI = full_grade[i]#int(input(f"Enter max grade of subject({i+1}) : "))
        from0to50 = df[(df.iloc[:, i+2] >= 0) & (df.iloc[:, i+2] < 0.5 * maxOfI)][df.columns[i+2]].count()
        from50to65 = df[(df.iloc[:, i+2] >= 0.5 * maxOfI) & (df.iloc[:, i+2] < 0.65 * maxOfI)][df.columns[i+2]].count()
        from65to75 = df[(df.iloc[:, i+2] >= 0.65 * maxOfI) & (df.iloc[:, i+2] < 0.75 * maxOfI)][df.columns[i+2]].count()
        from75to85 = df[(df.iloc[:, i+2] >= 0.75 * maxOfI) & (df.iloc[:, i+2] < 0.85 * maxOfI)][df.columns[i+2]].count()
        from85to100 = df[(df.iloc[:, i+2] >= 0.85 * maxOfI) & (df.iloc[:, i+2] <= maxOfI)][df.columns[i+2]].count()
        adict = {"subject":subject_name[i],"0->50":from0to50,"50->65":from50to65,"65->75":from65to75,"75->85":from75to85,"85->100":from85to100}
        stats.append(adict)
    maxOfI = 1500
    from0to50 = df.query(f'fullGrade_p > {0*maxOfI} & fullGrade_p <= {0.5*maxOfI}')['fullGrade_p'].count()
    from50to65 = df.query(f'fullGrade_p > {0.5*maxOfI} & fullGrade_p <= {0.65*maxOfI}')['fullGrade_p'].count()
    from65to75 = df.query(f'fullGrade_p > {0.65*maxOfI} & fullGrade_p <= {0.75*maxOfI}')['fullGrade_p'].count()
    from75to85 = df.query(f'fullGrade_p > {0.75*maxOfI} & fullGrade_p <={0.85*maxOfI}')['fullGrade_p'].count()
    from85to100 = df.query(f'fullGrade_p > {0.85*maxOfI} & fullGrade_p <= {maxOfI}')['fullGrade_p'].count()
    adict = {"subject":"fullGrade_p","0->50":from0to50,"50->65":from50to65,"65->75":from65to75,"75->85":from75to85,"85->100":from85to100}
    stats.append(adict)
    from0to50 = df.query(f'fullGrade_1 > {0*maxOfI} & fullGrade_1 <= {0.5*maxOfI}')['fullGrade_1'].count()
    from50to65 = df.query(f'fullGrade_1 > {0.5*maxOfI} & fullGrade_1 <= {0.65*maxOfI}')['fullGrade_1'].count()
    from65to75 = df.query(f'fullGrade_1 > {0.65*maxOfI} & fullGrade_1 <= {0.75*maxOfI}')['fullGrade_1'].count()
    from75to85 = df.query(f'fullGrade_1 > {0.75*maxOfI} & fullGrade_1 <={0.85*maxOfI}')['fullGrade_1'].count()
    from85to100 = df.query(f'fullGrade_1 > {0.85*maxOfI} & fullGrade_1 <= {maxOfI}')['fullGrade_1'].count()
    adict = {"subject":"fullGrade_1","0->50":from0to50,"50->65":from50to65,"65->75":from65to75,"75->85":from75to85,"85->100":from85to100}
    stats.append(adict)
    from0to50 = df.query(f'fullGrade > {0*maxOfI} & fullGrade <= {0.5*maxOfI}')['fullGrade'].count()
    from50to65 = df.query(f'fullGrade > {0.5*maxOfI} & fullGrade <= {0.65*maxOfI}')['fullGrade'].count()
    from65to75 = df.query(f'fullGrade > {0.65*maxOfI} & fullGrade <= {0.75*maxOfI}')['fullGrade'].count()
    from75to85 = df.query(f'fullGrade > {0.75*maxOfI} & fullGrade <={0.85*maxOfI}')['fullGrade'].count()
    from85to100 = df.query(f'fullGrade > {0.85*maxOfI} & fullGrade <= {maxOfI}')['fullGrade'].count()
    adict = {"subject":"fullGrade","0->50":from0to50,"50->65":from50to65,"65->75":from65to75,"75->85":from75to85,"85->100":from85to100}
    stats.append(adict)
    maxOfI = 1500*3
    from0to50 = df.query(f'total > {0*maxOfI} & total <= {0.5*maxOfI}')['total'].count()
    from50to65 = df.query(f'total > {0.5*maxOfI} & total <= {0.65*maxOfI}')['total'].count()
    from65to75 = df.query(f'total > {0.65*maxOfI} & total <= {0.75*maxOfI}')['total'].count()
    from75to85 = df.query(f'total > {0.75*maxOfI} & total <={0.85*maxOfI}')['total'].count()
    from85to100 = df.query(f'total > {0.85*maxOfI} & total <= {maxOfI}')['total'].count()
    adict = {"subject":"total","0->50":from0to50,"50->65":from50to65,"65->75":from65to75,"75->85":from75to85,"85->100":from85to100}
    stats.append(adict)

def output_statistics_csv(dire,nos):
    calculate_statistics(dire,nos)
    keys = stats[0].keys()
    with open('statistics.csv','w', encoding='utf-8-sig', newline='') as output_file :
        dict_writer =csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(stats)

def claculate_rank_csv(directory,nOfSubject):
     df = pd.read_csv (directory,encoding='utf-8')
     for i in range(nOfSubject):
          df = df.sort_values(by=df.columns[i + 2], ascending=False)
          df[f'{subject_name[i]}_Rank'] = pd.factorize(df[df.columns[i + 2]])[0]
          df[f'{subject_name[i]}_Rank'] = df[f'{subject_name[i]}_Rank'] + 1
     
     df = df.sort_values(by='total', ascending=False)
     df['total_Rank'] = pd.factorize(df['total'])[0]
     df['total_Rank'] = df['total_Rank'] + 1
     df = df.sort_values(by='fullGrade_p', ascending=False)
     df['fullGrade_p_Rank'] = pd.factorize(df['fullGrade_p'])[0]
     df['fullGrade_p_Rank'] = df['fullGrade_p_Rank'] + 1
     df = df.sort_values(by='fullGrade_1', ascending=False)
     df['fullGrade_1_Rank'] = pd.factorize(df['fullGrade_1'])[0]
     df['fullGrade_1_Rank'] = df['fullGrade_1_Rank'] + 1
     df = df.sort_values(by='fullGrade', ascending=False)
     df['fullGrade_Rank'] = pd.factorize(df['fullGrade'])[0]
     df['fullGrade_Rank'] = df['fullGrade_Rank'] + 1
     df['index'] = range(1, len(df) + 1)
     df.to_csv('result.csv', index=False, encoding='utf-8')

def fullGrade_calculate(directory):
    df = pd.read_csv(directory, encoding='utf-8')
    df = df.fillna(0)
    df['fullGrade'] = df[subject_name[0]] + df[subject_name[1]] + df[subject_name[2]] + df[subject_name[3]] + df[subject_name[4]] + df[subject_name[5]] + df[subject_name[6]] + df[subject_name[7]] + df[subject_name[8]] + df[subject_name[9]] + df[subject_name[10]] + df[subject_name[11]]
    dfo = pd.read_csv('reso.csv')
    dfo = dfo.fillna(0)
    merged_data = pd.merge(df, dfo, on="ST.NO.", how='inner')
    merged_data['total'] = merged_data['fullGrade'] + merged_data['fullGrade_p'] + merged_data['fullGrade_1']
    merged_data = merged_data.drop_duplicates()
    merged_data.to_csv('scraped.csv', index=False, encoding='utf-8')

def upload_to_Server():
    with open('result.csv', encoding='utf-8') as file :
        read = csv.DictReader(file)
        for row in read:
            subject_1_value = float(row[subject_name[0]]) if row[subject_name[0]] != '' else 0.0
            subject_2_value = float(row[subject_name[1]]) if row[subject_name[1]] != '' else 0.0
            subject_3_value = float(row[subject_name[2]]) if row[subject_name[2]] != '' else 0.0
            subject_4_value = float(row[subject_name[3]]) if row[subject_name[3]] != '' else 0.0
            subject_5_value = float(row[subject_name[4]]) if row[subject_name[4]] != '' else 0.0
            subject_6_value = float(row[subject_name[5]]) if row[subject_name[5]] != '' else 0.0
            subject_7_value = float(row[subject_name[6]]) if row[subject_name[6]] != '' else 0.0
            subject_8_value = float(row[subject_name[7]]) if row[subject_name[7]] != '' else 0.0
            subject_9_value = float(row[subject_name[8]]) if row[subject_name[8]] != '' else 0.0
            subject_10_value = float(row[subject_name[9]]) if row[subject_name[9]] != '' else 0.0
            subject_11_value = float(row[subject_name[10]]) if row[subject_name[10]] != '' else 0.0
            subject_12_value = float(row[subject_name[11]]) if row[subject_name[11]] != '' else 0.0
            fullGrade_p_value = float(row['fullGrade_p']) if row['fullGrade_p'] != '' else 0.0
            fullGrade_1_value = float(row['fullGrade_1']) if row['fullGrade_1'] != '' else 0.0
            fullGrade_value = float(row['fullGrade']) if row['fullGrade'] != '' else 0.0
            total_value = float(row['total']) if row['total'] != '' else 0.0

            data1 = {
                "STNu": row['ST.NO.'],
                "STNa": row['ST.Name'],
                "Subject_1": int(subject_1_value),
                "Subject_2": int(subject_2_value),
                "Subject_3": int(subject_3_value),
                "Subject_4": int(subject_4_value),
                "Subject_5": int(subject_5_value),
                "Subject_6": int(subject_6_value),
                "Subject_7": int(subject_7_value),
                "Subject_8": int(subject_8_value),
                "Subject_9": int(subject_9_value),
                "Subject_10": int(subject_10_value),
                "Subject_11": int(subject_11_value),
                "Subject_12": int(subject_12_value),
                "fullGrade_p": int(fullGrade_p_value),
                "fullGrade_1": int(fullGrade_1_value),
                "fullGrade": int(fullGrade_value),
                "total":int(total_value)
            }

            data2 = {
                     "Subject_1_Rank":int(row[f'{subject_name[0]}_Rank']),
                     "Subject_2_Rank":int(row[f'{subject_name[1]}_Rank']),
                     "Subject_3_Rank":int(row[f'{subject_name[2]}_Rank']),
                     "Subject_4_Rank":int(row[f'{subject_name[3]}_Rank']),
                     "Subject_5_Rank":int(row[f'{subject_name[4]}_Rank']),
                     "Subject_6_Rank":int(row[f'{subject_name[5]}_Rank']),
                     "Subject_7_Rank":int(row[f'{subject_name[6]}_Rank']),
                     "Subject_8_Rank":int(row[f'{subject_name[7]}_Rank']),
                     "Subject_9_Rank":int(row[f'{subject_name[8]}_Rank']),
                     "Subject_10_Rank":int(row[f'{subject_name[9]}_Rank']),
                     "Subject_11_Rank":int(row[f'{subject_name[10]}_Rank']),
                     "Subject_12_Rank":int(row[f'{subject_name[11]}_Rank']),
                     "fullGrade_p_Rank":int(row['fullGrade_p_Rank']),
                     "fullGrade_1_Rank":int(row['fullGrade_1_Rank']),
                     "fullGrade_Rank":int(row['fullGrade_Rank']),
                     "total_Rank":int(row['total_Rank']),
                     }
            data5[row['index']] = f"{row['ST.Name']},{int(float(row['fullGrade']))},{int(row['fullGrade_Rank'])}"
            doc_ref = db.collection("2523_res").document(data1['STNu'])
            doc_ref.set(data1)
            doc_ref = db.collection("2523_rank").document(data1['STNu'])
            doc_ref.set(data2)
            print(f"St {row['ST.NO.']} uploaded")
    doc_ref = db.collection("top").document('2523')
    doc_ref.set(data5)

    with open('statistics.csv', encoding='utf-8') as file:
        read = csv.DictReader(file)
        for index, row in enumerate(read):
            data6[f'{index+1}'] = f"{row['85->100']},{row['75->85']},{row['65->75']},{row['50->65']},{row['0->50']}"
            print("Statistics of Subject added, Index:", index)
    doc_ref = db.collection("stats").document('2523')
    doc_ref.set(data6)
    
    data4 = {"Subject_1": subject_name[0],
             "Subject_2": subject_name[1],
             "Subject_3": subject_name[2],
             "Subject_4": subject_name[3],
             "Subject_5": subject_name[4],
             "Subject_6": subject_name[5],
             "Subject_7": subject_name[6],
             "Subject_8": subject_name[7],
             "Subject_9": subject_name[8],
             "Subject_10":subject_name[9],
             "Subject_11":subject_name[10],
             "Subject_12":subject_name[11],
    }
    doc_ref = db.collection("s_names").document('2523')
    doc_ref.set(data4)





def main():
    #url = input("Enter the url : ")
    cookies = init_cookies("http://app1.helwan.edu.eg/FaslBU/EngHelwan/HasasnUpMlist.asp?z_dep=%3D&z_st_name=LIKE&z_st_settingno=%3D&x_st_settingno=&x_st_name=&z_gro=%3D&x_gro=%C7%E1%CB%C7%E4%ED%C9&x_dep=%E5%E4%CF%D3%C9+%C7%E1%CD%C7%D3%C8%C7%CA+%E6%C7%E1%E4%D9%E3&z_sec=LIKE&x_sec=&psearch=&Submit=++++%C8%CD%CB++++")
    #nOfPages = int(input("Enter the number of pages : "))
    urls = get_urls(8,cookies)
    save_res(urls)
    fullGrade_calculate('scraped.csv')
    output_statistics_csv('scraped.csv',12)
    claculate_rank_csv('scraped.csv',12)
    #upload_to_Server()
    #print(data5)


main()

